'use client';
import { WalletUiAccountGuard, WalletUiDropdown } from '@wallet-ui/react';
import { Card } from 'fumadocs-ui/components/card';
import { DocsReactWalletProvider } from './docs-react-wallet-provider';

export function DocsReactComponentAccountGuard() {
    return (
        <DocsReactWalletProvider>
            <WalletUiAccountGuard
                fallback={
                    <Card title="Disconnected state" description="Please connect a wallet to see the main content.">
                        <WalletUiDropdown />
                    </Card>
                }
                render={({ account }) => (
                    <Card title="Connected state" description="It is only visible when a wallet is connected.">
                        <p>Connected to {account.address}.</p>
                        <WalletUiDropdown />
                    </Card>
                )}
            />
        </DocsReactWalletProvider>
    );
}
