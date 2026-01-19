import { PublicKey } from '@solana/web3.js';
import {
    AppIdentity,
    AuthorizationResult,
    AuthorizeAPI,
    AuthToken,
    Base64EncodedAddress,
    Chain,
    DeauthorizeAPI,
    SignInPayload,
    SolanaMobileWalletAdapterProtocolError,
    SolanaMobileWalletAdapterProtocolErrorCode,
} from '@solana-mobile/mobile-wallet-adapter-protocol';
import { WalletIcon } from '@wallet-standard/core';
import { useCallback, useMemo } from 'react';

import { createAsyncStorageCache } from './async-storage-cache';
import { Cache } from './cache';
import { getAuthorizationFromAuthorizationResult } from './get-authorization-from-authorization-result';
import { useAuthorizationStorage } from './use-authorization-storage';

export type Account = Readonly<{
    address: Base64EncodedAddress;
    icon?: WalletIcon;
    label?: string;
    publicKey: PublicKey;
}>;

export type WalletAuthorization = Readonly<{
    accounts: Account[];
    authToken: AuthToken;
    selectedAccount: Account;
}>;
export type WalletAuthorizationCache = Cache<WalletAuthorization | undefined>;
export type WalletAuthorizationProps = Readonly<{
    cache?: WalletAuthorizationCache;
    chain: Chain;
    identity: AppIdentity;
}>;
export function useAuthorization({ cache, chain, identity }: WalletAuthorizationProps) {
    const memoizedCache = useMemo(() => cache ?? createAsyncStorageCache<WalletAuthorization>(), [cache]);

    const { accounts, authToken, isLoading, persist, selectedAccount } = useAuthorizationStorage({
        cache: memoizedCache,
    });

    const handleAuthorizationResult = useCallback(
        async (authorizationResult: AuthorizationResult): Promise<WalletAuthorization> => {
            const nextAuthorization = getAuthorizationFromAuthorizationResult(authorizationResult, selectedAccount);
            await persist(nextAuthorization);
            return nextAuthorization;
        },
        [selectedAccount, persist],
    );

    const authorizeSession = useCallback(
        async (wallet: AuthorizeAPI) => {
            try {
                const authorizationResult = await wallet.authorize({
                    auth_token: authToken,
                    chain,
                    identity,
                });
                return (await handleAuthorizationResult(authorizationResult)).selectedAccount;
            } catch (error) {
                if (
                    error instanceof SolanaMobileWalletAdapterProtocolError &&
                    error.code === SolanaMobileWalletAdapterProtocolErrorCode.ERROR_AUTHORIZATION_FAILED
                ) {
                    const retryResult = await wallet.authorize({
                        chain,
                        identity,
                    });
                    return (await handleAuthorizationResult(retryResult)).selectedAccount;
                }
                throw error;
            }
        },
        [authToken, chain, identity, handleAuthorizationResult],
    );

    const authorizeSessionWithSignIn = useCallback(
        async (wallet: AuthorizeAPI, signInPayload: SignInPayload) => {
            try {
                const authorizationResult = await wallet.authorize({
                    auth_token: authToken,
                    chain,
                    identity,
                    sign_in_payload: signInPayload,
                });
                return (await handleAuthorizationResult(authorizationResult)).selectedAccount;
            } catch (error) {
                if (
                    error instanceof SolanaMobileWalletAdapterProtocolError &&
                    error.code === SolanaMobileWalletAdapterProtocolErrorCode.ERROR_AUTHORIZATION_FAILED
                ) {
                    const retryResult = await wallet.authorize({
                        chain,
                        identity,
                        sign_in_payload: signInPayload,
                    });
                    return (await handleAuthorizationResult(retryResult)).selectedAccount;
                }
                throw error;
            }
        },
        [authToken, chain, identity, handleAuthorizationResult],
    );

    const deauthorizeSession = useCallback(
        async (wallet: DeauthorizeAPI) => {
            if (authToken == null) {
                return;
            }
            await wallet.deauthorize({ auth_token: authToken });
            await persist(null);
        },
        [authToken, persist],
    );

    const deauthorizeSessions = useCallback(async () => {
        await persist(null, true);
    }, [persist]);

    return useMemo(
        () => ({
            accounts,
            authorizeSession,
            authorizeSessionWithSignIn,
            deauthorizeSession,
            deauthorizeSessions,
            isLoading,
            selectedAccount,
        }),
        [
            accounts,
            authorizeSession,
            authorizeSessionWithSignIn,
            deauthorizeSession,
            deauthorizeSessions,
            isLoading,
            selectedAccount,
        ],
    );
}
