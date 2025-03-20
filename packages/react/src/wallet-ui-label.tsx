import React from 'react';

import { WalletUiSize } from './types/wallet-ui-size';
import { WalletUiWallet } from './types/wallet-ui-wallet';

export interface WalletUiLabelProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    size?: WalletUiSize;
    wallet?: WalletUiWallet;
}

export function WalletUiLabel({ className, size, wallet, ...props }: WalletUiLabelProps) {
    if (!wallet) {
        return null;
    }

    return (
        <span className={`wallet-ui-list-label ${size ?? 'md'} ${className ?? ''}`} {...props}>
            {wallet.name}
        </span>
    );
}
