import React from 'react';

import { WalletUiButton } from './types/wallet-ui-button';
import { WalletUiSize } from './types/wallet-ui-size';
import { WalletUiWallet } from './types/wallet-ui-wallet';
import { WalletUiIcon } from './wallet-ui-icon';
import { WalletUiLabel } from './wallet-ui-label';

export interface WalletUiListItemProps extends Omit<WalletUiButton, 'onClick'> {
    select?: (wallet: WalletUiWallet) => Promise<void>;
    size?: WalletUiSize;
    wallet: WalletUiWallet;
}

export function WalletUiListItem({ className, select, size = 'md', wallet, ...props }: WalletUiListItemProps) {
    const [pending, setPending] = React.useState(false);

    function handleSelect() {
        if (!select) {
            return;
        }
        setPending(true);
        void select(wallet).finally(() => setPending(false));
    }

    return (
        <button
            disabled={pending}
            className={`wallet-ui-list-item ${size} ${pending ? 'wallet-ui-list-item-pending' : ''} ${className ?? ''}`}
            onClick={handleSelect}
            {...props}
        >
            <WalletUiIcon className="wallet-ui-list-item-icon" wallet={wallet} size={size} />
            <WalletUiLabel className="wallet-ui-list-item-label" wallet={wallet} size={size} />
        </button>
    );
}
