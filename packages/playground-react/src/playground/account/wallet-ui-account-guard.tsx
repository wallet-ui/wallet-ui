import { useWalletUiAccount, WalletUiDropdown } from '@wallet-ui/react';
import { WalletUiAccountInfo } from '@wallet-ui/react/src/wallet-ui-account-context';
import React from 'react';

export interface WalletUiAccountGuardProps {
    fallback?: React.ReactNode;
    render: (info: WalletUiAccountInfo) => React.ReactNode;
}

export function WalletUiAccountGuard({ fallback = <WalletUiDropdown />, render }: WalletUiAccountGuardProps) {
    const { account, accountKeys, wallet } = useWalletUiAccount();

    return account ? render({ account, accountKeys, wallet }) : fallback;
}
