import { Transaction, TransactionSignature, VersionedTransaction } from '@solana/web3.js';
import { AuthorizeAPI, SignInPayload } from '@solana-mobile/mobile-wallet-adapter-protocol';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { useCallback, useContext, useMemo } from 'react';

import { MobileWalletProviderContext } from './mobile-wallet-provider';
import { Account, useAuthorization } from './use-authorization';

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
        async (
            transaction: Transaction | VersionedTransaction,
            minContextSlot: number,
        ): Promise<TransactionSignature> =>
            await transact(async wallet => {
                await authorizeSession(wallet);
                const signatures = await wallet.signAndSendTransactions({
                    minContextSlot,
                    transactions: [transaction],
                });
                return signatures[0];
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

    const signTransaction = useCallback(
        async <T extends Transaction | VersionedTransaction, K extends T | T[]>(transaction: K): Promise<K> =>
            await transact(async wallet => {
                await authorizeSession(wallet);
                const signedTxs = await wallet.signTransactions({
                    transactions: Array.isArray(transaction) ? transaction : [transaction],
                });
                return Array.isArray(transaction) ? signedTxs : signedTxs[0];
            }),

        [authorizeSession],
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
            signAndSendTransaction,
            signIn,
            signMessage,
            signTransaction,
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
            signIn,
            signMessage,
            signTransaction,
        ],
    );
}
