import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-kit';
import {
    ClientWithRpc,
    ClientWithSubscribeToPayer,
    createTransactionPlanExecutor,
    extendClient,
    getBase58Decoder,
    GetLatestBlockhashApi,
    pipe,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    signAndSendTransactionMessageWithSigners,
    signature,
    TransactionPlanExecutor,
    TransactionSendingSigner,
} from '@solana/kit';

import { authorizeMobileWalletSession } from './authorize-mobile-wallet-session';
import { getAuthorizationFromAuthorizationResult } from './get-authorization-from-authorization-result';
import type { Account, WalletAuthorizationProps } from './use-authorization';

export type MobileWalletConfig = Readonly<Pick<WalletAuthorizationProps, 'chain' | 'identity' | 'store'>>;

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
    return <T extends ClientWithRpc<GetLatestBlockhashApi>>(client: T) => {
        if (!client.rpc) {
            throw new Error('An RPC instance is required on the client before using the mobile wallet plugin.');
        }

        const transactionPlanExecutor = createTransactionPlanExecutor({
            executeTransactionMessage: async (context, transactionMessage, executorConfig) => {
                executorConfig?.abortSignal?.throwIfAborted();
                const {
                    context: { slot: minContextSlot },
                    value: latestBlockhash,
                } = await client.rpc.getLatestBlockhash().send(executorConfig);
                const signer = createMobileWalletTransactionSigner(config, minContextSlot);
                const message = pipe(
                    transactionMessage,
                    tx => setTransactionMessageFeePayerSigner(signer, tx),
                    tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
                );
                context.message = message;
                const signatureBytes = await signAndSendTransactionMessageWithSigners(message, executorConfig);
                return signature(decoder.decode(signatureBytes));
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
