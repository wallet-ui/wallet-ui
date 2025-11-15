import { Transaction, TransactionSignature, VersionedTransaction } from '@solana/web3.js';
import { AppIdentity, AuthorizeAPI, SignInPayload } from '@solana-mobile/mobile-wallet-adapter-protocol';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { SolanaClusterId } from '@wallet-ui/core';
import { useCallback, useMemo } from 'react';

import { Account, useAuthorization } from './use-authorization';

export function useMobileWallet({ clusterId, identity }: { clusterId: SolanaClusterId; identity: AppIdentity }) {
    const { authorizeSessionWithSignIn, authorizeSession, deauthorizeSessions } = useAuthorization({
        clusterId,
        identity,
    });

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

    const disconnect = useCallback(async (): Promise<void> => {
        await deauthorizeSessions();
    }, [deauthorizeSessions]);

    const signAndSendTransaction = useCallback(
        async (
            transaction: Transaction | VersionedTransaction,
            minContextSlot: number,
        ): Promise<TransactionSignature> => {
            return await transact(async wallet => {
                await authorizeSession(wallet);
                const signatures = await wallet.signAndSendTransactions({
                    minContextSlot,
                    transactions: [transaction],
                });
                return signatures[0];
            });
        },
        [authorizeSession],
    );

    const signMessage = useCallback(
        async (message: Uint8Array): Promise<Uint8Array> => {
            return await transact(async wallet => {
                const authResult = await authorizeSession(wallet);
                const signedMessages = await wallet.signMessages({
                    addresses: [authResult.address],
                    payloads: [message],
                });
                return signedMessages[0];
            });
        },
        [authorizeSession],
    );

    return useMemo(
        () => ({
            connect,
            connectAnd,
            disconnect,
            signAndSendTransaction,
            signIn,
            signMessage,
        }),
        [connect, connectAnd, disconnect, signAndSendTransaction, signIn, signMessage],
    );
}
