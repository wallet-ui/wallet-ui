import {
    Address,
    appendTransactionMessageInstructions,
    createTransactionMessage,
    getBase58Decoder,
    Instruction,
    pipe,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    signAndSendTransactionMessageWithSigners,
    SignatureBytes,
    Transaction,
    TransactionSendingSigner,
} from '@solana/kit';
import { AuthorizeAPI, SignInPayload } from '@solana-mobile/mobile-wallet-adapter-protocol';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-kit';
import { useCallback, useContext, useMemo } from 'react';

import { MobileWalletProviderContext } from './mobile-wallet-provider';
import { Account, useAuthorization } from './use-authorization';

const decoder = getBase58Decoder();
export function useMobileWallet() {
    const ctx = useContext(MobileWalletProviderContext);
    const {
        authorizeSessionWithSignIn,
        authorizeSession,
        deauthorizeSessions,
        selectedAccount,
        accounts,
        deauthorizeSession,
    } = useAuthorization(ctx);

    const connect = useCallback(
        async (): Promise<Account> => await transact(async wallet => await authorizeSession(wallet)),
        [authorizeSession],
    );

    const connectAnd = useCallback(
        async (cb: (wallet: AuthorizeAPI) => Promise<Account | void>): Promise<Account | void> => {
            return await transact(async wallet => await cb(wallet));
        },
        [],
    );

    const signIn = useCallback(
        async (signInPayload: SignInPayload): Promise<Account> =>
            await transact(async wallet => await authorizeSessionWithSignIn(wallet, signInPayload)),
        [authorizeSessionWithSignIn],
    );

    const disconnect = useCallback(async (): Promise<void> => await deauthorizeSessions(), [deauthorizeSessions]);

    const signAndSendTransaction = useCallback(
        async (transaction: Transaction | Transaction[], minContextSlot: bigint): Promise<SignatureBytes[]> =>
            await transact(async wallet => {
                await authorizeSession(wallet);
                return await wallet.signAndSendTransactions({
                    minContextSlot: Number(minContextSlot),
                    transactions: Array.isArray(transaction) ? transaction : [transaction],
                });
            }),
        [authorizeSession],
    );

    const signMessage = useCallback(
        async (message: Uint8Array): Promise<Uint8Array> =>
            await transact(async wallet => {
                const authResult = await authorizeSession(wallet);
                const signedMessages = await wallet.signMessages({
                    addresses: [authResult.addressBase64],
                    payloads: [message],
                });
                return signedMessages[0];
            }),
        [authorizeSession],
    );

    const getTransactionSigner = useCallback(
        (address: Address, minContextSlot: bigint): TransactionSendingSigner => {
            return {
                address,
                signAndSendTransactions: async (transactions: Transaction[]) => {
                    return await signAndSendTransaction(transactions, minContextSlot);
                },
            };
        },
        [signAndSendTransaction],
    );

    const sendTransaction = useCallback(
        async (instructions: Instruction[]) => {
            if (!selectedAccount) {
                throw new Error('No account selected');
            }
            const {
                context: { slot: minContextSlot },
                value: latestBlockhash,
            } = await ctx.client.rpc.getLatestBlockhash().send();

            const signer = getTransactionSigner(selectedAccount.address, minContextSlot);

            const transactionMessage = pipe(
                createTransactionMessage({ version: 0 }),
                tx => appendTransactionMessageInstructions(instructions, tx),
                tx => setTransactionMessageFeePayerSigner(signer, tx),
                tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
            );

            const signatureBytes = await signAndSendTransactionMessageWithSigners(transactionMessage);
            return decoder.decode(signatureBytes);
        },
        [ctx.client.rpc, getTransactionSigner, selectedAccount],
    );

    return useMemo(
        () => ({
            ...ctx,
            account: selectedAccount,
            accounts,
            connect,
            connectAnd,
            deauthorizeSession,
            disconnect,
            getTransactionSigner,
            sendTransaction,
            signAndSendTransaction,
            signIn,
            signMessage,
        }),
        [
            accounts,
            connect,
            connectAnd,
            ctx,
            deauthorizeSession,
            disconnect,
            getTransactionSigner,
            selectedAccount,
            sendTransaction,
            signAndSendTransaction,
            signIn,
            signMessage,
        ],
    );
}
