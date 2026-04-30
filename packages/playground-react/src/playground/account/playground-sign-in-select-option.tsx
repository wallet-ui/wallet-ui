import {
    BaseButton,
    type UiWallet,
    type UiWalletAccount,
    useWalletUiAuth,
    WalletUiAuth,
    type WalletUiAuthState,
} from '@wallet-ui/react';
import React, { useCallback } from 'react';

export function PlaygroundSignInSelectOption({
    onSignIn,
    onError,
    wallet,
}: {
    onError(err: unknown): void;
    onSignIn(account: UiWalletAccount | undefined): void;
    wallet: UiWallet;
}) {
    return (
        <WalletUiAuth wallet={wallet}>
            {auth => (
                <PlaygroundSignInSelectOptionButton auth={auth} onError={onError} onSignIn={onSignIn} wallet={wallet} />
            )}
        </WalletUiAuth>
    );
}

export function PlaygroundSignInSelectOptionHook({
    onSignIn,
    onError,
    wallet,
}: {
    onError(err: unknown): void;
    onSignIn(account: UiWalletAccount | undefined): void;
    wallet: UiWallet;
}) {
    return (
        <PlaygroundSignInSelectOptionHookButton
            key={wallet.name}
            onError={onError}
            onSignIn={onSignIn}
            wallet={wallet}
        />
    );
}

function PlaygroundSignInSelectOptionHookButton({
    onError,
    onSignIn,
    wallet,
}: {
    onError(err: unknown): void;
    onSignIn(account: UiWalletAccount | undefined): void;
    wallet: UiWallet;
}) {
    const auth = useWalletUiAuth({ wallet });

    return <PlaygroundSignInSelectOptionButton auth={auth} onError={onError} onSignIn={onSignIn} wallet={wallet} />;
}

function PlaygroundSignInSelectOptionButton({
    auth,
    onError,
    onSignIn,
    wallet,
}: {
    auth: WalletUiAuthState;
    onError(err: unknown): void;
    onSignIn(account: UiWalletAccount | undefined): void;
    wallet: UiWallet;
}) {
    const handleSignInClick = useCallback(
        async (e: React.MouseEvent) => {
            e.preventDefault();
            try {
                const { account } = await auth.signIn({
                    input: {
                        statement: 'You will enjoy being signed in.',
                    },
                });
                onSignIn(account);
            } catch (e) {
                onError(e);
            }
        },
        [auth, onSignIn, onError],
    );
    return (
        <BaseButton
            label={wallet.name}
            onClick={handleSignInClick}
            value={wallet.name}
            disabled={!auth.canSignIn || auth.isSigningIn}
        />
    );
}
