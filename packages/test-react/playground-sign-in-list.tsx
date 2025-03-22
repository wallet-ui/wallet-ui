import { SolanaSignIn, type UiWallet, useWallets, useWalletUiAccount } from '@wallet-ui/react';
import React, { useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { PlaygroundError } from './playground-error';
import { PlaygroundErrorPanel } from './playground-error-panel';
import { PlaygroundSignInSelectOption } from './playground-sign-in-select-option';

export function PlaygroundSignInList() {
    const { current: NO_ERROR } = useRef(Symbol());
    const wallets = useWallets();
    const { setAccount } = useWalletUiAccount();
    const [error, setError] = useState(NO_ERROR);

    function renderItem(wallet: UiWallet, index: number) {
        return (
            <ErrorBoundary
                fallbackRender={({ error }) => <PlaygroundError error={error} />}
                key={`wallet:${wallet.name}`}
            >
                <PlaygroundSignInSelectOption
                    key={index}
                    onSignIn={account => {
                        setAccount(account);
                    }}
                    onError={setError}
                    wallet={wallet}
                />
            </ErrorBoundary>
        );
    }

    const supportedWallets = wallets.filter(wallet => wallet.features.includes(SolanaSignIn));

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                }}
            >
                {supportedWallets.map((wallet, index) => renderItem(wallet, index))}
            </div>
            {error !== NO_ERROR ? <PlaygroundErrorPanel error={error} onClose={() => setError(NO_ERROR)} /> : null}
        </>
    );
}
