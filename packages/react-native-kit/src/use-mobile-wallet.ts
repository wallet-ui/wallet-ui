import { Address, SignatureBytes, Transaction, TransactionSendingSigner } from '@solana/kit';
import { AuthorizeAPI, SignInPayload } from '@solana-mobile/mobile-wallet-adapter-protocol';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-kit';
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
            signAndSendTransaction,
            signIn,
            signMessage,
        ],
    );
}
