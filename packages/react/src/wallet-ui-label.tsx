import { UiWallet } from '@wallet-standard/react';
import React from 'react';

export interface WalletUiLabelProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    wallet?: Pick<UiWallet, 'name'>;
}

export function WalletUiLabel({ className, wallet, ...props }: WalletUiLabelProps) {
    if (!wallet) {
        return null;
    }

    return (
        <span data-wu="wallet-ui-label" className={`${className ?? ''}`} {...props}>
            {wallet.name}
        </span>
    );
}
