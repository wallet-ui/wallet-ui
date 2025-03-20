import React from 'react';

import { WalletUiDiv } from './types/wallet-ui-div';
import { WalletUiSize } from './types/wallet-ui-size';
import { WalletUiWallet } from './types/wallet-ui-wallet';
import { WalletUiListItem } from './wallet-ui-list-item';

export interface WalletUiListProps extends WalletUiDiv {
    select?: (wallet: WalletUiWallet) => Promise<void>;
    size?: WalletUiSize;
    wallets: WalletUiWallet[];
}

export function WalletUiList({ className, select, size = 'md', wallets, ...props }: WalletUiListProps) {
    return (
        <div className={`wallet-ui-list ${size} ${className ?? ''}`} {...props}>
            {wallets.map(wallet => (
                <WalletUiListItem key={wallet.name} select={select} size={size} wallet={wallet} />
            ))}
        </div>
    );
}
