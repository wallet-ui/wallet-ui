import { UiWallet } from '@wallet-standard/react';
import React from 'react';

import { WalletUiImg } from './types/wallet-ui-img';

export interface WalletUiIconProps extends WalletUiImg {
    wallet?: Pick<UiWallet, 'icon' | 'name'>;
}

export function WalletUiIcon({ className, wallet, ...props }: WalletUiIconProps) {
    if (!wallet) {
        return null;
    }

    return <img data-wu="wallet-ui-icon" src={wallet.icon} alt={wallet.name} className={className ?? ''} {...props} />;
}
