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
    Transaction,
    TransactionSendingSigner,
} from '@solana/kit';
import { AuthorizeAPI, SignInPayload } from '@solana-mobile/mobile-wallet-adapter-protocol';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-kit';
import { useCallback, useContext, useMemo } from 'react';

import { SignInOutput } from './convert-sign-in-result';
import { MobileWalletProviderContext } from './mobile-wallet-provider';
import { TransactionSignatures } from './types';
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
        async (signInPayload: SignInPayload): Promise<SignInOutput> =>
            await transact(async wallet => await authorizeSessionWithSignIn(wallet, signInPayload)),
        [authorizeSessionWithSignIn],
    );

    const disconnect = useCallback(async (): Promise<void> => await deauthorizeSessions(), [deauthorizeSessions]);

    const signAndSendTransactions = useCallback(
        async <T extends Transaction | Transaction[]>(
            transaction: T,
            minContextSlot: bigint,
        ): Promise<TransactionSignatures<T>> =>
            await transact(async wallet => {
                await authorizeSession(wallet);
                const isTransactionsArray = Array.isArray(transaction);
                const signatures = await wallet.signAndSendTransactions({
                    minContextSlot: Number(minContextSlot),
                    transactions: isTransactionsArray ? transaction : [transaction],
                });

                return isTransactionsArray
                    ? (signatures as TransactionSignatures<T>)
                    : (signatures[0] as TransactionSignatures<T>);
            }),
        [authorizeSession],
    );

    const signMessages = useCallback(
        async <K extends Uint8Array | Uint8Array[]>(message: K): Promise<K> =>
            await transact(async wallet => {
                const authResult = await authorizeSession(wallet);
                const payloads: Uint8Array[] = Array.isArray(message) ? message : [message];
                const signed = await wallet.signMessages({
                    addresses: payloads.map(() => authResult.addressBase64),
                    payloads,
                });
                return (Array.isArray(message) ? signed : signed[0]) as K;
            }),
        [authorizeSession],
    );

    const signTransactions = useCallback(
        async <T extends Transaction | Transaction[]>(transaction: T): Promise<T> =>
            await transact(async wallet => {
                await authorizeSession(wallet);
                const signedTxs = await wallet.signTransactions({
                    transactions: Array.isArray(transaction) ? transaction : [transaction],
                });
                return Array.isArray(transaction) ? signedTxs : signedTxs[0];
            }),

        [authorizeSession],
    );

    const getTransactionSigner = useCallback(
        (address: Address, minContextSlot: bigint): TransactionSendingSigner => {
            return {
                address,
                signAndSendTransactions: async (transactions: Transaction[]) => {
                    return await signAndSendTransactions(transactions, minContextSlot);
                },
            };
        },
        [signAndSendTransactions],
    );

    const sendTransactions = useCallback(
        async (instructions: Instruction[]): Promise<string> => {
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

    /** @deprecated Use sendTransactions instead. */
    const sendTransaction = useCallback(
        async (instructions: Instruction[]): Promise<string> => {
            console.warn('[wallet-ui] `sendTransaction` is deprecated. Use `sendTransactions` instead.');
            return await sendTransactions(instructions);
        },
        [sendTransactions],
    );

    /** @deprecated Use signAndSendTransactions instead. */
    const signAndSendTransaction = useCallback(
        async <T extends Transaction | Transaction[]>(
            transaction: T,
            minContextSlot: bigint,
        ): Promise<TransactionSignatures<T>> => {
            console.warn('[wallet-ui] `signAndSendTransaction` is deprecated. Use `signAndSendTransactions` instead.');
            return await signAndSendTransactions(transaction, minContextSlot);
        },
        [signAndSendTransactions],
    );

    /** @deprecated Use signMessages instead. */
    const signMessage = useCallback(
        async <K extends Uint8Array | Uint8Array[]>(message: K): Promise<K> => {
            console.warn('[wallet-ui] `signMessage` is deprecated. Use `signMessages` instead.');
            return await signMessages(message);
        },
        [signMessages],
    );

    /** @deprecated Use signTransactions instead. */
    const signTransaction = useCallback(
        async <T extends Transaction | Transaction[]>(transaction: T): Promise<T> => {
            console.warn('[wallet-ui] `signTransaction` is deprecated. Use `signTransactions` instead.');
            return await signTransactions(transaction);
        },
        [signTransactions],
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
            sendTransactions,
            signAndSendTransaction,
            signAndSendTransactions,
            signIn,
            signMessage,
            signMessages,
            signTransaction,
            signTransactions,
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
            sendTransactions,
            signAndSendTransaction,
            signAndSendTransactions,
            signIn,
            signMessage,
            signMessages,
            signTransaction,
            signTransactions,
        ],
    );
}
