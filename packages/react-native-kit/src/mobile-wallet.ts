import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-kit';
import {
    ClientWithRpc,
    ClientWithSubscribeToPayer,
    createTransactionPlanExecutor,
    estimateAndSetResourceLimitsFactory,
    estimateResourceLimitsFactory,
    extendClient,
    getBase58Decoder,
    GetLatestBlockhashApi,
    pipe,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    signAndSendTransactionMessageWithSigners,
    signature,
    SimulateTransactionApi,
    TransactionPlanExecutor,
    TransactionSendingSigner,
} from '@solana/kit';

import { authorizeMobileWalletSession } from './authorize-mobile-wallet-session';
import { getAuthorizationFromAuthorizationResult } from './get-authorization-from-authorization-result';
import { getComputeUnitLimitFromEstimate as defaultGetComputeUnitLimitFromEstimate } from './resource-limits';
import type { Account, WalletAuthorizationProps } from './use-authorization';

export type MobileWalletConfig = Readonly<
    Pick<WalletAuthorizationProps, 'chain' | 'identity' | 'store'> & {
        /**
         * Whether the transaction plan executor should simulate each transaction message before sending it, to
         * estimate and set its resource limits (the compute unit limit and, for version 1 transaction messages, the
         * loaded accounts data size limit).
         *
         * Only limits that are unset or still provisory are replaced; explicit limits are left untouched. Version 1
         * transactions are budgeted zero compute units when they carry no compute unit limit, so leave this on when
         * planning version 1 transactions unless every message sets its own limits.
         *
         * Keep this in sync with the `estimateResourceLimits` option of `rpcTransactionPlanner`.
         *
         * Defaults to `true`.
         */
        estimateResourceLimits?: boolean;
        /**
         * Maps the simulated compute unit consumption to the compute unit limit that is actually set on the message.
         * The default adds a buffer of at least 300 compute units and between 2% and 10% of the estimate.
         */
        getComputeUnitLimitFromEstimate?: (estimatedComputeUnits: number) => number;
    }
>;

export type ClientWithMobileWallet = ClientWithSubscribeToPayer & {
    readonly payer: TransactionSendingSigner;
    readonly transactionPlanExecutor: TransactionPlanExecutor;
    readonly wallet: Readonly<{
        connect: () => Promise<Account>;
        disconnect: () => Promise<void>;
    }>;
};

const decoder = getBase58Decoder();

export function mobileWallet(config: MobileWalletConfig) {
    return <T extends ClientWithRpc<GetLatestBlockhashApi & SimulateTransactionApi>>(client: T) => {
        if (!client.rpc) {
            throw new Error('An RPC instance is required on the client before using the mobile wallet plugin.');
        }

        const shouldEstimateResourceLimits = config.estimateResourceLimits ?? true;
        const getComputeUnitLimitFromEstimate =
            config.getComputeUnitLimitFromEstimate ?? defaultGetComputeUnitLimitFromEstimate;
        const estimateResourceLimits = estimateResourceLimitsFactory({ rpc: client.rpc });
        const estimateAndSetResourceLimits = estimateAndSetResourceLimitsFactory(
            async (transactionMessage, estimateConfig) => {
                const estimate = await estimateResourceLimits(transactionMessage, estimateConfig);
                return {
                    ...estimate,
                    computeUnitLimit: getComputeUnitLimitFromEstimate(estimate.computeUnitLimit),
                };
            },
        );

        const transactionPlanExecutor = createTransactionPlanExecutor({
            executeTransactionMessage: async (context, transactionMessage, executorConfig) => {
                executorConfig?.abortSignal?.throwIfAborted();
                const {
                    context: { slot: minContextSlot },
                    value: latestBlockhash,
                } = await client.rpc.getLatestBlockhash().send(executorConfig);
                const signer = createMobileWalletTransactionSigner(config, minContextSlot);
                let message = pipe(
                    transactionMessage,
                    tx => setTransactionMessageFeePayerSigner(signer, tx),
                    tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
                );
                context.message = message;
                if (shouldEstimateResourceLimits) {
                    message = await estimateAndSetResourceLimits(message, executorConfig);
                    context.message = message;
                }
                const signatureBytes = await signAndSendTransactionMessageWithSigners(message, executorConfig);
                const transactionSignature = signature(decoder.decode(signatureBytes));
                context.signature = transactionSignature;
                return { message, signature: transactionSignature };
            },
        });

        // Cached per selected account so repeated reads return the same reference. `subscribeToPayer` + `payer` is a
        // `useSyncExternalStore` pair; a fresh object on every read would re-render without end.
        let cachedAccount: Account | undefined;
        let cachedPayer: TransactionSendingSigner | undefined;

        const additions = {
            subscribeToPayer: (listener: () => void) => config.store.$selectedAccount.listen(() => listener()),
            transactionPlanExecutor,
            wallet: {
                connect: async () => await transact(async wallet => await authorizeWithStore(config, wallet)),
                disconnect: async () => await config.store.persist(null),
            },
        } as Record<string, unknown>;
        Object.defineProperty(additions, 'payer', {
            configurable: true,
            enumerable: false,
            get: () => {
                const account = config.store.$selectedAccount.get();
                if (!cachedPayer || cachedAccount !== account) {
                    cachedPayer = createMobileWalletTransactionSigner(config);
                    cachedAccount = account;
                }
                return cachedPayer;
            },
        });

        return extendClient(client, additions as ClientWithMobileWallet);
    };
}

function createMobileWalletTransactionSigner(
    config: MobileWalletConfig,
    minContextSlot?: bigint,
): TransactionSendingSigner {
    const account = config.store.$selectedAccount.get();
    if (!account) {
        throw new Error(
            'No mobile wallet account is authorized. Call `connect()` before requesting the mobile wallet payer.',
        );
    }

    return {
        address: account.address,
        signAndSendTransactions: async (transactions, signerConfig) => {
            signerConfig?.abortSignal?.throwIfAborted();
            const signatures = await transact(async wallet => {
                await authorizeWithStore(config, wallet);
                signerConfig?.abortSignal?.throwIfAborted();
                return await wallet.signAndSendTransactions({
                    ...(minContextSlot == null ? {} : { minContextSlot: Number(minContextSlot) }),
                    transactions: [...transactions],
                });
            });
            signerConfig?.abortSignal?.throwIfAborted();
            return signatures;
        },
    };
}

async function authorizeWithStore(
    config: MobileWalletConfig,
    wallet: Parameters<typeof authorizeMobileWalletSession>[1],
) {
    return await authorizeMobileWalletSession(
        {
            authToken: config.store.$authToken.get(),
            chain: config.chain,
            handleAuthorizationResult: async authorizationResult => {
                const authorization = getAuthorizationFromAuthorizationResult(
                    authorizationResult,
                    config.store.$selectedAccount.get(),
                );
                await config.store.persist(authorization);
                return authorization;
            },
            identity: config.identity,
        },
        wallet,
    );
}
