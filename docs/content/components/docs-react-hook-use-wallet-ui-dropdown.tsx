'use client';
import { BaseDropdown, useWalletUiDropdown } from '@wallet-ui/react';
import { DocsReactWalletProvider } from './docs-react-wallet-provider';

function Dropdown() {
    const { buttonProps, items, dropdown } = useWalletUiDropdown();
    return <BaseDropdown buttonProps={buttonProps} dropdown={dropdown} items={items} />;
}

export function DocsReactHookUseWalletUiDropdown() {
    return (
        <DocsReactWalletProvider>
            <Dropdown />
        </DocsReactWalletProvider>
    );
}
