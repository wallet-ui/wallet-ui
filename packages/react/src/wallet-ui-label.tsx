import { UiWallet } from '@wallet-standard/react';
import React from 'react';

import { WalletUiSize } from './types/wallet-ui-size';

export interface WalletUiLabelProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    size?: WalletUiSize;
    wallet?: Pick<UiWallet, 'name'>;
}

export function WalletUiLabel({ className, size, wallet, ...props }: WalletUiLabelProps) {
    if (!wallet) {
        return null;
    }

    return (
        <span data-wu="wallet-ui-label" className={`${size ?? 'md'} ${className ?? ''}`} {...props}>
            {wallet.name}
        </span>
    );
}
