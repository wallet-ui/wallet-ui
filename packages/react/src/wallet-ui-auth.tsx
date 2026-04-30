import { useSignMessage } from '@solana/react';
import { SolanaSignIn, SolanaSignMessage } from '@solana/wallet-standard-features';
import { StandardConnect } from '@wallet-standard/core';
import { useConnect } from '@wallet-standard/react';
import React, { useCallback, useState } from 'react';

import { useWalletUi } from './use-wallet-ui';
import { useWalletUiAuthMessage } from './use-wallet-ui-auth-message';
import { useWalletUiAuthNative } from './use-wallet-ui-auth-native';
import {
    type UiWalletAccount,
    WalletUiAuthError,
    type WalletUiAuthProps,
    type WalletUiAuthState,
} from './wallet-ui-auth-types';
import { getTargetAccount, hasFeature, signInWithMessageFeature } from './wallet-ui-auth-utils';

export function WalletUiAuth({ children, wallet }: WalletUiAuthProps) {
    const { account } = useWalletUi();
    const targetAccount = getTargetAccount(account, wallet);

    if (hasFeature(wallet, SolanaSignIn)) {
        return <WalletUiAuthNative wallet={wallet}>{children}</WalletUiAuthNative>;
    }
    if (targetAccount && hasFeature(targetAccount, SolanaSignMessage)) {
        return (
            <WalletUiAuthMessage account={targetAccount} wallet={wallet}>
                {children}
            </WalletUiAuthMessage>
        );
    }
    if (hasFeature(wallet, SolanaSignMessage) && hasFeature(wallet, StandardConnect)) {
        return <WalletUiAuthMessageConnect wallet={wallet}>{children}</WalletUiAuthMessageConnect>;
    }

    return children({
        canSignIn: false,
        isSigningIn: false,
        messageSigningAvailable: false,
        nativeSignInAvailable: false,
        reason: 'auth-unsupported',
        signIn() {
            return Promise.reject(new WalletUiAuthError('auth-unsupported'));
        },
    });
}

function WalletUiAuthMessage({
    account,
    children,
    wallet,
}: WalletUiAuthProps & {
    account: UiWalletAccount;
}) {
    const signMessage = useSignMessage(account);
    const auth = useWalletUiAuthMessage({ account, signMessage, wallet });
    return children(auth);
}

function WalletUiAuthMessageConnect({ children, wallet }: WalletUiAuthProps) {
    const { connect: selectAccount } = useWalletUi();
    const [isConnecting, connectWallet] = useConnect(wallet);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const signIn = useCallback<WalletUiAuthState['signIn']>(
        async ({ input = {} } = {}) => {
            setIsSigningIn(true);
            try {
                const [firstAccount] = await connectWallet();

                if (!firstAccount) {
                    throw new WalletUiAuthError('wallet-not-connected');
                }

                if (!hasFeature(firstAccount, SolanaSignMessage)) {
                    throw new WalletUiAuthError('auth-unsupported');
                }

                const result = await signInWithMessageFeature({
                    account: firstAccount,
                    input,
                });
                selectAccount(firstAccount);
                return result;
            } finally {
                setIsSigningIn(false);
            }
        },
        [connectWallet, selectAccount],
    );

    return children({
        canSignIn: true,
        isSigningIn: isConnecting || isSigningIn,
        messageSigningAvailable: false,
        nativeSignInAvailable: false,
        reason: undefined,
        signIn,
    });
}

function WalletUiAuthNative({ children, wallet }: WalletUiAuthProps) {
    return children(useWalletUiAuthNative({ wallet }));
}
