import { Transaction, VersionedTransaction } from '@solana/web3.js';
import { AuthorizeAPI, SignInPayload } from '@solana-mobile/mobile-wallet-adapter-protocol';
import { useCallback, useContext, useMemo } from 'react';

import { SignInOutput } from './convert-sign-in-result';
import { MobileWalletProviderContext } from './mobile-wallet-provider';
import { createMobileWalletTransport } from './mobile-wallet-transport';
import { TransactionSignatures } from './types';
import { Account, useAuthorization } from './use-authorization';

export function useMobileWallet() {
    const ctx = useContext(MobileWalletProviderContext);
    const transport = useMemo(() => createMobileWalletTransport(), []);
    const {
        authorizeSessionWithSignIn,
        authorizeSession,
        deauthorizeSessions,
        selectedAccount,
        accounts,
        deauthorizeSession,
    } = useAuthorization(ctx);

    const connect = useCallback(
        async (): Promise<Account> => await transport.transact(async wallet => await authorizeSession(wallet)),
        [authorizeSession, transport],
    );

    const connectAnd = useCallback(
        async (cb: (wallet: AuthorizeAPI) => Promise<Account | void>): Promise<Account | void> => {
            return await transport.transact(async wallet => await cb(wallet));
        },
        [transport],
    );

    const signIn = useCallback(
        async (signInPayload: SignInPayload): Promise<SignInOutput> =>
            await transport.transact(async wallet => await authorizeSessionWithSignIn(wallet, signInPayload)),
        [authorizeSessionWithSignIn, transport],
    );

    const disconnect = useCallback(async (): Promise<void> => await deauthorizeSessions(), [deauthorizeSessions]);

    const signAndSendTransactions = useCallback(
        async <T extends Transaction | VersionedTransaction, K extends T | T[]>(
            transaction: K,
            minContextSlot: number,
        ): Promise<TransactionSignatures<K>> =>
            await transport.transact(async wallet => {
                await authorizeSession(wallet);

                const isTransactionsArray = Array.isArray(transaction);

                const signatures = await wallet.signAndSendTransactions({
                    minContextSlot,
                    transactions: isTransactionsArray ? transaction : [transaction],
                });

                return isTransactionsArray
                    ? (signatures as TransactionSignatures<K>)
                    : (signatures[0] as TransactionSignatures<K>);
            }),
        [authorizeSession, transport],
    );

    const signMessages = useCallback(
        async <K extends Uint8Array | Uint8Array[]>(message: K): Promise<K> =>
            await transport.transact(async wallet => {
                const authResult = await authorizeSession(wallet);
                const payloads: Uint8Array[] = Array.isArray(message) ? message : [message];
                const signed = await wallet.signMessages({
                    addresses: payloads.map(() => authResult.addressBase64),
                    payloads,
                });
                return (Array.isArray(message) ? signed : signed[0]) as K;
            }),
        [authorizeSession, transport],
    );

    const signTransactions = useCallback(
        async <T extends Transaction | VersionedTransaction, K extends T | T[]>(transaction: K): Promise<K> =>
            await transport.transact(async wallet => {
                await authorizeSession(wallet);
                const signedTxs = await wallet.signTransactions({
                    transactions: Array.isArray(transaction) ? transaction : [transaction],
                });
                return Array.isArray(transaction) ? signedTxs : signedTxs[0];
            }),

        [authorizeSession, transport],
    );

    /** @deprecated Use signAndSendTransactions instead. */
    const signAndSendTransaction = useCallback(
        async <T extends Transaction | VersionedTransaction, K extends T | T[]>(
            transaction: K,
            minContextSlot: number,
        ): Promise<TransactionSignatures<K>> => {
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
        async <T extends Transaction | VersionedTransaction, K extends T | T[]>(transaction: K): Promise<K> => {
            console.warn('[wallet-ui] `signTransaction` is deprecated. Use `signTransactions` instead.');
            return await signTransactions(transaction);
        },
        [signTransactions],
    );

    return useMemo(
        () => ({
            ...ctx,
            account: transport.isSupported ? selectedAccount : undefined,
            accounts: transport.isSupported ? accounts : [],
            capabilities: transport.capabilities,
            connect,
            connectAnd,
            deauthorizeSession,
            disconnect,
            isSupported: transport.isSupported,
            platform: transport.platform,
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
            selectedAccount,
            signAndSendTransaction,
            signAndSendTransactions,
            signIn,
            signMessage,
            signMessages,
            signTransaction,
            signTransactions,
            transport,
        ],
    );
}
