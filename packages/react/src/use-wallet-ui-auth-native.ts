import { SolanaSignMessage } from '@solana/wallet-standard-features';
import { useCallback, useState } from 'react';

import { useWalletUi } from './use-wallet-ui';
import { type UseWalletUiAuthOptions, WalletUiAuthError, type WalletUiAuthState } from './wallet-ui-auth-types';
import { getTargetAccount, hasFeature, signInWithNativeFeature } from './wallet-ui-auth-utils';

export interface UseWalletUiAuthNativeOptions extends UseWalletUiAuthOptions {
    enabled?: boolean;
}

export function useWalletUiAuthNative({ enabled = true, wallet }: UseWalletUiAuthNativeOptions): WalletUiAuthState {
    const { account, connect } = useWalletUi();
    const [isSigningIn, setIsSigningIn] = useState(false);
    const targetAccount = getTargetAccount(account, wallet);
    const messageSigningAvailable = hasFeature(targetAccount, SolanaSignMessage);
    const signIn = useCallback(
        async ({ input = {} } = {}) => {
            if (!enabled) {
                throw new WalletUiAuthError('auth-unsupported');
            }
            setIsSigningIn(true);
            try {
                return await signInWithNativeFeature({
                    account: targetAccount,
                    connect,
                    input,
                    wallet,
                });
            } finally {
                setIsSigningIn(false);
            }
        },
        [connect, enabled, targetAccount, wallet],
    );

    return {
        canSignIn: enabled,
        isSigningIn,
        messageSigningAvailable,
        nativeSignInAvailable: enabled,
        reason: enabled ? undefined : 'auth-unsupported',
        signIn,
    };
}
