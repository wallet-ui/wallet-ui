import React from 'react';

import { useWalletUiAccount } from './use-wallet-ui-account';
import { WalletUiAccountInfo } from './wallet-ui-account-context';
import { WalletUiDropdown } from './wallet-ui-dropdown';

export interface WalletUiAccountGuardProps {
    fallback?: React.ReactNode;
    render: (info: WalletUiAccountInfo) => React.ReactNode;
}

export function WalletUiAccountGuard({ fallback = <WalletUiDropdown />, render }: WalletUiAccountGuardProps) {
    const { account, accountKeys, cluster, wallet } = useWalletUiAccount();

    return account ? render({ account, accountKeys, cluster, wallet }) : fallback;
}
