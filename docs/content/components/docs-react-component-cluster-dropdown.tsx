'use client';
import { WalletUiClusterDropdown, WalletUiSize } from '@wallet-ui/react';
import { DocsReactWalletProvider } from './docs-react-wallet-provider';

export function DocsReactComponentClusterDropdown({ size }: { size: WalletUiSize }) {
    return (
        <DocsReactWalletProvider>
            <WalletUiClusterDropdown size={size} />
        </DocsReactWalletProvider>
    );
}
