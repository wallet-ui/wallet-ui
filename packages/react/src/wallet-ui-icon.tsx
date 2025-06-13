import { UiWallet } from '@wallet-standard/react';
import React from 'react';

import { WalletUiImg } from './types/wallet-ui-img';
import { WalletUiSize } from './types/wallet-ui-size';

export interface WalletUiIconProps extends WalletUiImg {
    size?: WalletUiSize;
    wallet?: Pick<UiWallet, 'icon' | 'name'>;
}

export function WalletUiIcon({ className, size = 'md', wallet, ...props }: WalletUiIconProps) {
    if (!wallet) {
        return null;
    }

    return (
        <img
            data-wu="wallet-ui-icon"
            src={wallet.icon}
            alt={wallet.name}
            className={`${size} ${className ?? ''}`}
            {...props}
        />
    );
}
