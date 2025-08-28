import { UiWallet, UiWalletAccount } from '@wallet-standard/react';
import React from 'react';

import { WalletUiDiv } from './types/wallet-ui-div';
import { WalletUiListButton } from './wallet-ui-list-button';

export interface WalletUiListProps extends WalletUiDiv {
    select?: (account: UiWalletAccount) => Promise<void>;
    wallets: UiWallet[];
}

export function WalletUiList({ className, select, wallets, ...props }: WalletUiListProps) {
    return (
        <div data-wu="wallet-ui-list" className={`${className ?? ''}`} {...props}>
            {wallets.map(wallet => (
                <WalletUiListButton key={wallet.name} select={select} wallet={wallet} />
            ))}
        </div>
    );
}
