import React, { ImgHTMLAttributes } from 'react';

import { WalletUiSize } from './types/wallet-ui-size';
import { WalletUiWallet } from './types/wallet-ui-wallet';

export interface WalletUiIconProps
    extends React.DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    size?: WalletUiSize;
    wallet?: WalletUiWallet;
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
