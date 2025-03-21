import { UiWallet } from '@wallet-standard/react';
import React from 'react';

import { WalletUiSize } from './types/wallet-ui-size';

export interface WalletUiLabelProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    size?: WalletUiSize;
    wallet?: UiWallet;
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
