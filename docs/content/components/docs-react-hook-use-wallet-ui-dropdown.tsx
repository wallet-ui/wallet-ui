'use client';
import { BaseDropdown, useWalletUiDropdown, WalletUiSize } from '@wallet-ui/react';
import { DocsReactWalletProvider } from './docs-react-wallet-provider';

function Dropdown({ size }: { size: WalletUiSize }) {
    const { buttonProps, items, dropdown } = useWalletUiDropdown({ size });
    return <BaseDropdown buttonProps={buttonProps} dropdown={dropdown} items={items} size={size} />;
}

export function DocsReactHookUseWalletUiDropdown({ size }: { size: WalletUiSize }) {
    return (
        <DocsReactWalletProvider>
            <Dropdown size={size} />
        </DocsReactWalletProvider>
    );
}
