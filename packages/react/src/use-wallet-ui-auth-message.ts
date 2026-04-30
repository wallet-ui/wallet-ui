import { useCallback, useState } from 'react';

import {
    type UiWalletAccount,
    type UseWalletUiAuthOptions,
    WalletUiAuthError,
    type WalletUiAuthSignMessage,
    type WalletUiAuthState,
    type WalletUiAuthUnavailableReason,
} from './wallet-ui-auth-types';
import { signInWithMessageFeature, signInWithMessageSigner } from './wallet-ui-auth-utils';

export interface UseWalletUiAuthMessageOptions extends UseWalletUiAuthOptions {
    account: UiWalletAccount | undefined;
    enabled?: boolean;
    reason?: WalletUiAuthUnavailableReason;
    signMessage?: WalletUiAuthSignMessage;
}

export function useWalletUiAuthMessage({
    account,
    enabled = Boolean(account),
    reason = account ? 'message-signing-unavailable' : 'wallet-not-connected',
    signMessage,
}: UseWalletUiAuthMessageOptions): WalletUiAuthState {
    const [isSigningIn, setIsSigningIn] = useState(false);
    const canSignIn = Boolean(enabled && account);
    const unavailableReason = account ? reason : 'wallet-not-connected';
    const signIn = useCallback(
        async ({ input = {} } = {}) => {
            if (!canSignIn || !account) {
                throw new WalletUiAuthError(unavailableReason);
            }
            setIsSigningIn(true);
            try {
                if (signMessage) {
                    return await signInWithMessageSigner({
                        account,
                        input,
                        signMessage,
                    });
                }
                return await signInWithMessageFeature({
                    account,
                    input,
                });
            } finally {
                setIsSigningIn(false);
            }
        },
        [account, canSignIn, signMessage, unavailableReason],
    );

    return {
        canSignIn,
        isSigningIn,
        messageSigningAvailable: canSignIn,
        nativeSignInAvailable: false,
        reason: canSignIn ? undefined : unavailableReason,
        signIn,
    };
}
