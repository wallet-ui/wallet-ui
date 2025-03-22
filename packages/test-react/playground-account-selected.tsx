import { useWalletUiAccount, WalletUiDropdown } from '@wallet-ui/react';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { PlaygroundErrorBoundaryNotSupported } from './playground-error-boundary-not-supported';
import { PlaygroundSignAndSendTx } from './playground-sign-and-send-tx';
import { PlaygroundSignInMenuButtons } from './playground-sign-in-menu-buttons';
import { PlaygroundSignMessageBase } from './playground-sign-message-base';
import { PlaygroundUiPanel } from './playground-ui-panel';
import { Stack } from './stack';
import { WalletUiAccountSignMessageLoader } from './wallet-ui-account-sign-message-loader';

export function PlaygroundAccountSelected() {
    const { account, errorBoundaryResetKeys } = useWalletUiAccount();

    if (!account) {
        return (
            <div>
                <WalletUiDropdown />
            </div>
        );
    }

    return (
        <Stack>
            <PlaygroundUiPanel title="Sign And Send Tx">
                <ErrorBoundary
                    FallbackComponent={PlaygroundErrorBoundaryNotSupported}
                    resetKeys={errorBoundaryResetKeys}
                >
                    <PlaygroundSignAndSendTx account={account} />
                </ErrorBoundary>
            </PlaygroundUiPanel>
            <PlaygroundUiPanel title="Sign Message">
                <ErrorBoundary
                    FallbackComponent={PlaygroundErrorBoundaryNotSupported}
                    resetKeys={errorBoundaryResetKeys}
                >
                    <WalletUiAccountSignMessageLoader
                        account={account}
                        render={({ signMessage }) => {
                            return <PlaygroundSignMessageBase signMessage={signMessage} />;
                        }}
                    />
                </ErrorBoundary>
            </PlaygroundUiPanel>
            <PlaygroundUiPanel title="Sign In">
                <ErrorBoundary
                    FallbackComponent={PlaygroundErrorBoundaryNotSupported}
                    resetKeys={errorBoundaryResetKeys}
                >
                    <PlaygroundSignInMenuButtons />
                </ErrorBoundary>
            </PlaygroundUiPanel>
        </Stack>
    );
}
