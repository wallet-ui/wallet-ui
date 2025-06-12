import { UiWallet, UiWalletAccount } from '@wallet-standard/react';
import React from 'react';

import { WalletUiDiv } from './types/wallet-ui-div';
import { WalletUiSize } from './types/wallet-ui-size';
import { WalletUiListButton } from './wallet-ui-list-button';

export interface WalletUiListProps extends WalletUiDiv {
    select?: (account: UiWalletAccount) => Promise<void>;
    size?: WalletUiSize;
    wallets: UiWallet[];
}

export function WalletUiList({ className, select, size = 'md', wallets, ...props }: WalletUiListProps) {
    return (
        <div data-wu="wallet-ui-list" className={`${size} ${className ?? ''}`} {...props}>
            {wallets.map(wallet => (
                <WalletUiListButton key={wallet.name} select={select} size={size} wallet={wallet} />
            ))}
        </div>
    );
}
