import type { SignatureBytes, Transaction } from '@solana/kit';
import { AuthorizeAPI, SignInPayload } from '@solana-mobile/mobile-wallet-adapter-protocol';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-kit';
import { useCallback, useContext, useMemo } from 'react';

import { MobileWalletProviderContext } from './mobile-wallet-provider';
import { Account, useAuthorization } from './use-authorization';

export function useMobileWallet() {
    const ctx = useContext(MobileWalletProviderContext);
    const { authorizeSessionWithSignIn, authorizeSession, deauthorizeSessions, selectedAccount, ...authorization } =
        useAuthorization(ctx);

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
            transaction: Transaction,
            minContextSlot: number,
        ): Promise<SignatureBytes> =>
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
                    addresses: [authResult.address],
                    payloads: [message],
                });
                return signedMessages[0];
            }),
        [authorizeSession],
    );

    return useMemo(
        () => ({
            ...ctx,
            ...authorization,
            account: selectedAccount,
            connect,
            connectAnd,
            disconnect,
            signAndSendTransaction,
            signIn,
            signMessage,
        }),
        [
            authorization,
            connect,
            connectAnd,
            ctx,
            disconnect,
            selectedAccount,
            signAndSendTransaction,
            signIn,
            signMessage,
        ],
    );
}
