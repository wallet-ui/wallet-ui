'use client';
import { WalletUiClusterDropdown } from '@wallet-ui/react';
import { DocsReactWalletProvider } from './docs-react-wallet-provider';

export function DocsReactComponentClusterDropdown() {
    return (
        <DocsReactWalletProvider>
            <WalletUiClusterDropdown />
        </DocsReactWalletProvider>
    );
}
