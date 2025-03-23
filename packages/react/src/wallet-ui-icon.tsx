import { UiWallet } from '@wallet-standard/react';
import React from 'react';

import { WalletUiImg } from './types/wallet-ui-img';
import { WalletUiSize } from './types/wallet-ui-size';

export interface WalletUiIconProps extends WalletUiImg {
    size?: WalletUiSize;
    wallet?: Pick<UiWallet, 'icon' | 'name'>;
}

export function WalletUiIcon({ className, size, wallet, ...props }: WalletUiIconProps) {
    if (!wallet) {
        return null;
    }

    return (
        <img
            src={wallet.icon}
            alt={wallet.name}
            className={`wallet-ui-list-icon ${size ?? 'md'} ${className ?? ''}`}
            {...props}
        />
    );
}
