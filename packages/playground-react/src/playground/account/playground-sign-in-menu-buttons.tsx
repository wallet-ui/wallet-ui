import { useWalletUiAccount } from '@wallet-ui/react';
import React, { useRef } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { useError } from '../../lib/use-error';

import { PlaygroundError } from '../playground-error';
import { PlaygroundErrorPanel } from '../playground-error-panel';
import { PlaygroundSignInSelectOption } from './playground-sign-in-select-option';

export function PlaygroundSignInMenuButtons() {
    const { current: NO_ERROR } = useRef(Symbol());
    const { setAccount, wallet } = useWalletUiAccount();
    const { error, setError } = useError();

    if (!wallet) {
        return <PlaygroundError error={'No wallet selected'} />;
    }

    return (
        <>
            <ErrorBoundary
                fallbackRender={({ error }) => <PlaygroundError error={error} />}
                key={`wallet:${wallet.name}`}
            >
                <PlaygroundSignInSelectOption
                    onSignIn={account => {
                        setAccount(account);
                    }}
                    onError={setError}
                    wallet={wallet}
                />
            </ErrorBoundary>
            {error !== NO_ERROR ? <PlaygroundErrorPanel error={error} onClose={() => setError(NO_ERROR)} /> : null}
        </>
    );
}
