'use client';
import { WalletUiDropdown, WalletUiSize } from '@wallet-ui/react';
import { DocsReactWalletProvider } from './docs-react-wallet-provider';

export function DocsReactComponentDropdown({ size }: { size: WalletUiSize }) {
    return (
        <DocsReactWalletProvider>
            <WalletUiDropdown size={size} />
        </DocsReactWalletProvider>
    );
}
