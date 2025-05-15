'use client';
import { useWalletUi, WalletUiClusterDropdown, WalletUiDropdown } from '@wallet-ui/react';
import React from 'react';

export function PlaygroundUiWalletButtons() {
    const { accountKeys } = useWalletUi();
    return (
        <div className="flex gap-4">
            <WalletUiDropdown />
            <WalletUiClusterDropdown />
            <pre>{JSON.stringify(accountKeys, null, 2)}</pre>
        </div>
    );
}
