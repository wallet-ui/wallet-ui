import { WalletUiClusterDropdown, WalletUiDropdown } from '@wallet-ui/react';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { UiPanel, UiStack } from '../../ui/';
import { WalletUiAccountSignMessageLoader } from '../../wallet-ui-account-sign-message-loader';
import { PlaygroundErrorBoundaryNotSupported } from '../playground-error-boundary-not-supported';
import { PlaygroundSignAndSendTx } from './playground-sign-and-send-tx';
import { PlaygroundSignInMenuButtons } from './playground-sign-in-menu-buttons';
import { PlaygroundSignMessageBase } from './playground-sign-message-base';
import { WalletUiAccountGuard } from './wallet-ui-account-guard';

export function PlaygroundAccountSelected() {
    return (
        <WalletUiAccountGuard
            fallback={<WalletUiDropdown />}
            render={({ account, accountKeys }) => (
                <UiStack>
                    <WalletUiDropdown />
                    <WalletUiClusterDropdown />
                    <pre className="text-xs font-mono">{JSON.stringify({ accountKeys }, null, 2)}</pre>
                    <UiPanel title="Sign And Send Tx">
                        <ErrorBoundary FallbackComponent={PlaygroundErrorBoundaryNotSupported} resetKeys={accountKeys}>
                            <PlaygroundSignAndSendTx account={account} />
                        </ErrorBoundary>
                    </UiPanel>
                    <UiPanel title="Sign Message">
                        <ErrorBoundary FallbackComponent={PlaygroundErrorBoundaryNotSupported} resetKeys={accountKeys}>
                            <WalletUiAccountSignMessageLoader
                                account={account}
                                render={({ signMessage }) => {
                                    return <PlaygroundSignMessageBase signMessage={signMessage} />;
                                }}
                            />
                        </ErrorBoundary>
                    </UiPanel>
                    <UiPanel title="Sign In">
                        <ErrorBoundary FallbackComponent={PlaygroundErrorBoundaryNotSupported} resetKeys={accountKeys}>
                            <PlaygroundSignInMenuButtons />
                        </ErrorBoundary>
                    </UiPanel>
                </UiStack>
            )}
        />
    );
}
