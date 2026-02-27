import { Transaction, VersionedTransaction } from '@solana/web3.js';
import { AuthorizeAPI, SignInPayload } from '@solana-mobile/mobile-wallet-adapter-protocol';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { useCallback, useContext, useMemo } from 'react';

import { SignInOutput } from './convert-sign-in-result';
import { MobileWalletProviderContext } from './mobile-wallet-provider';
import { TransactionSignatures } from './types';
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
        async (signInPayload: SignInPayload): Promise<SignInOutput> =>
            await transact(async wallet => await authorizeSessionWithSignIn(wallet, signInPayload)),
        [authorizeSessionWithSignIn],
    );

    const disconnect = useCallback(async (): Promise<void> => await deauthorizeSessions(), [deauthorizeSessions]);

    const signAndSendTransaction = useCallback(
        async <T extends Transaction | VersionedTransaction, K extends T | T[]>(
            transaction: K,
            minContextSlot: number,
        ): Promise<TransactionSignatures<K>> =>
            await transact(async wallet => {
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
        [authorizeSession],
    );

    const signMessage = useCallback(
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
