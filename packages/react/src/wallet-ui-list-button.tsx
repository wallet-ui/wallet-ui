import { UiWallet, UiWalletAccount } from '@wallet-standard/react';
import React from 'react';

import { WalletUiButton } from './types/wallet-ui-button';
import { WalletUiSize } from './types/wallet-ui-size';
import { WalletUiIcon } from './wallet-ui-icon';
import { WalletUiLabel } from './wallet-ui-label';

export interface WalletUiListButtonProps extends Omit<WalletUiButton, 'onClick'> {
    select?: (wallet: UiWalletAccount) => Promise<void>;
    size?: WalletUiSize;
    wallet: UiWallet;
}

export function WalletUiListButton({ className, select, size = 'md', wallet, ...props }: WalletUiListButtonProps) {
    const [pending, setPending] = React.useState(false);

    function handleSelect() {
        if (!select) {
            return;
        }
        setPending(true);
        // TODO: Add support for multiple accounts, properly handle no accounts
        const account = wallet.accounts.length > 0 ? wallet.accounts[0] : undefined;
        if (!account) {
            return;
        }
        void select(account).finally(() => setPending(false));
    }

    return (
        <button
            disabled={pending}
            className={`wallet-ui-list-button ${size} ${pending ? 'wallet-ui-list-button-pending' : ''} ${className ?? ''}`}
            onClick={handleSelect}
            {...props}
        >
            <WalletUiIcon className="wallet-ui-list-button-icon" wallet={wallet} size={size} />
            <WalletUiLabel className="wallet-ui-list-button-label" wallet={wallet} size={size} />
        </button>
    );
}
