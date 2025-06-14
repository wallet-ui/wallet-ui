import { useWalletUiAccount, WalletUiAccountInfo, WalletUiDropdown } from '@wallet-ui/react';
import React from 'react';

export interface WalletUiAccountGuardProps {
    fallback?: React.ReactNode;
    render: (info: WalletUiAccountInfo) => React.ReactNode;
}

export function WalletUiAccountGuard({ fallback = <WalletUiDropdown />, render }: WalletUiAccountGuardProps) {
    const { account, accountKeys, cluster, wallet } = useWalletUiAccount();

    return account ? render({ account, accountKeys, cluster, wallet }) : fallback;
}
