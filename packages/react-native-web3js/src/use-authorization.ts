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
} from '@solana-mobile/mobile-wallet-adapter-protocol';
import { WalletIcon } from '@wallet-standard/core';
import { useCallback, useMemo } from 'react';

import { getAuthorizationFromAuthorizationResult } from './get-authorization-from-authorization-result';
import { useFetchAuthorization } from './use-fetch-authorization';
import { useInvalidateAuthorizations } from './use-invalidate-authorizations';
import { usePersistAuthorization } from './use-persist-authorization';

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

export function useAuthorization({ chain, identity }: { chain: Chain; identity: AppIdentity }) {
    const fetchQuery = useFetchAuthorization();
    const invalidateAuthorizations = useInvalidateAuthorizations();
    const persistMutation = usePersistAuthorization();

    const handleAuthorizationResult = useCallback(
        async (authorizationResult: AuthorizationResult): Promise<WalletAuthorization> => {
            const nextAuthorization = getAuthorizationFromAuthorizationResult(
                authorizationResult,
                fetchQuery.data?.selectedAccount,
            );
            await persistMutation.mutateAsync(nextAuthorization);
            return nextAuthorization;
        },
        [fetchQuery.data?.selectedAccount, persistMutation],
    );

    const authorizeSession = useCallback(
        async (wallet: AuthorizeAPI) => {
            const authorizationResult = await wallet.authorize({
                auth_token: fetchQuery.data?.authToken,
                chain,
                identity,
            });
            return (await handleAuthorizationResult(authorizationResult)).selectedAccount;
        },
        [fetchQuery.data?.authToken, chain, identity, handleAuthorizationResult],
    );

    const authorizeSessionWithSignIn = useCallback(
        async (wallet: AuthorizeAPI, signInPayload: SignInPayload) => {
            const authorizationResult = await wallet.authorize({
                auth_token: fetchQuery.data?.authToken,
                chain,
                identity,
                sign_in_payload: signInPayload,
            });
            return (await handleAuthorizationResult(authorizationResult)).selectedAccount;
        },
        [fetchQuery.data?.authToken, chain, identity, handleAuthorizationResult],
    );

    const deauthorizeSession = useCallback(
        async (wallet: DeauthorizeAPI) => {
            if (fetchQuery.data?.authToken == null) {
                return;
            }
            await wallet.deauthorize({ auth_token: fetchQuery.data.authToken });
            await persistMutation.mutateAsync(null);
        },
        [fetchQuery.data?.authToken, persistMutation],
    );

    const deauthorizeSessions = useCallback(async () => {
        await invalidateAuthorizations();
        await persistMutation.mutateAsync(null);
    }, [invalidateAuthorizations, persistMutation]);

    return useMemo(
        () => ({
            accounts: fetchQuery.data?.accounts ?? null,
            authorizeSession,
            authorizeSessionWithSignIn,
            deauthorizeSession,
            deauthorizeSessions,
            isLoading: fetchQuery.isLoading,
            selectedAccount: fetchQuery.data?.selectedAccount ?? null,
        }),
        [
            authorizeSession,
            authorizeSessionWithSignIn,
            deauthorizeSession,
            deauthorizeSessions,
            fetchQuery.data?.accounts,
            fetchQuery.data?.selectedAccount,
            fetchQuery.isLoading,
        ],
    );
}
