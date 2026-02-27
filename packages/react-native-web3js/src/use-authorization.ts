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

import { AuthorizationStore } from './authorization-store';
import { Cache } from './cache';
import { convertSignInResult, SignInOutput } from './convert-sign-in-result';
import { getAuthorizationFromAuthorizationResult } from './get-authorization-from-authorization-result';
import { useAuthorizationStore } from './use-authorization-store';

export type Account = Readonly<{
    address: PublicKey;
    addressBase64: Base64EncodedAddress;
    icon?: WalletIcon;
    label?: string;
    /**
     * @deprecated Use `address` instead.
     */
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
    store: AuthorizationStore;
}>;
export function useAuthorization({ chain, identity, store }: WalletAuthorizationProps) {
    const { accounts, authToken, persist, selectedAccount } = useAuthorizationStore({
        store,
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
        async (wallet: AuthorizeAPI, signInPayload: SignInPayload): Promise<SignInOutput> => {
            try {
                const result = await wallet.authorize({
                    auth_token: authToken,
                    chain,
                    identity,
                    sign_in_payload: signInPayload,
                });
                const { selectedAccount: account } = await handleAuthorizationResult(result);

                if (!result.sign_in_result) {
                    throw new Error('Sign in result not retrieved.');
                }
                return convertSignInResult({ account, signInResult: result.sign_in_result });
            } catch (error) {
                if (
                    error instanceof SolanaMobileWalletAdapterProtocolError &&
                    error.code === SolanaMobileWalletAdapterProtocolErrorCode.ERROR_AUTHORIZATION_FAILED
                ) {
                    const result = await wallet.authorize({
                        chain,
                        identity,
                        sign_in_payload: signInPayload,
                    });
                    if (!result.sign_in_result) {
                        throw new Error('Sign in result not retrieved.', { cause: error });
                    }
                    const { selectedAccount: account } = await handleAuthorizationResult(result);
                    return convertSignInResult({ account, signInResult: result.sign_in_result });
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
        await persist(null);
    }, [persist]);

    return useMemo(
        () => ({
            accounts,
            authorizeSession,
            authorizeSessionWithSignIn,
            deauthorizeSession,
            deauthorizeSessions,
            selectedAccount,
        }),
        [
            accounts,
            authorizeSession,
            authorizeSessionWithSignIn,
            deauthorizeSession,
            deauthorizeSessions,
            selectedAccount,
        ],
    );
}
