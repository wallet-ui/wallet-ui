import { SolanaSignIn, SolanaSignMessage } from '@solana/wallet-standard-features';

import { useWalletUi } from './use-wallet-ui';
import { useWalletUiAuthMessage } from './use-wallet-ui-auth-message';
import { useWalletUiAuthNative } from './use-wallet-ui-auth-native';
import { type UseWalletUiAuthOptions, WalletUiAuthError, type WalletUiAuthState } from './wallet-ui-auth-types';
import { getTargetAccount, hasFeature } from './wallet-ui-auth-utils';

export function useWalletUiAuth({ wallet }: UseWalletUiAuthOptions): WalletUiAuthState {
    const { account } = useWalletUi();
    const targetAccount = getTargetAccount(account, wallet);
    const nativeSignInAvailable = hasFeature(wallet, SolanaSignIn);
    const messageSigningAvailable = Boolean(targetAccount && hasFeature(targetAccount, SolanaSignMessage));
    const nativeAuth = useWalletUiAuthNative({ enabled: nativeSignInAvailable, wallet });
    const messageAuth = useWalletUiAuthMessage({
        account: targetAccount,
        enabled: messageSigningAvailable,
        reason: targetAccount ? 'message-signing-unavailable' : 'wallet-not-connected',
        wallet,
    });

    if (nativeSignInAvailable) {
        return nativeAuth;
    }
    if (messageSigningAvailable) {
        return messageAuth;
    }

    const reason =
        targetAccount || !hasFeature(wallet, SolanaSignMessage) ? 'auth-unsupported' : 'wallet-not-connected';

    return {
        canSignIn: false,
        isSigningIn: false,
        messageSigningAvailable: false,
        nativeSignInAvailable: false,
        reason,
        signIn() {
            return Promise.reject(new WalletUiAuthError(reason));
        },
    };
}

export {
    type UseWalletUiAuthOptions,
    WalletUiAuthError,
    type WalletUiAuthMethod,
    type WalletUiAuthResult,
    type WalletUiAuthSignInOptions,
    type WalletUiAuthState,
    type WalletUiAuthUnavailableReason,
} from './wallet-ui-auth-types';
