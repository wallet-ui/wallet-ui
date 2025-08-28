'use client';
import { WalletUiDropdown } from '@wallet-ui/react';
import { DocsReactWalletProvider } from './docs-react-wallet-provider';

export function DocsReactComponentDropdown() {
    return (
        <DocsReactWalletProvider>
            <WalletUiDropdown />
        </DocsReactWalletProvider>
    );
}
