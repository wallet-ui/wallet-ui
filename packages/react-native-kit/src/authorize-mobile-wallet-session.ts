import {
    AppIdentity,
    AuthorizeAPI,
    AuthorizationResult,
    AuthToken,
    Chain,
    SolanaMobileWalletAdapterProtocolError,
    SolanaMobileWalletAdapterProtocolErrorCode,
} from '@solana-mobile/mobile-wallet-adapter-protocol';

import { assertValidIdentityUri } from './assert-valid-identity-uri';
import type { WalletAuthorization } from './use-authorization';

export type AuthorizeMobileWalletSessionConfig = Readonly<{
    authToken?: AuthToken;
    chain: Chain;
    handleAuthorizationResult: (authorizationResult: AuthorizationResult) => Promise<WalletAuthorization>;
    identity: AppIdentity;
}>;

export async function authorizeMobileWalletSession(
    { authToken, chain, handleAuthorizationResult, identity }: AuthorizeMobileWalletSessionConfig,
    wallet: AuthorizeAPI,
) {
    assertValidIdentityUri(identity);

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
            const authorizationResult = await wallet.authorize({ chain, identity });
            return (await handleAuthorizationResult(authorizationResult)).selectedAccount;
        }
        throw error;
    }
}
