import React, { ButtonHTMLAttributes } from 'react';

import { useSolanaWalletUi } from './solana-wallet-ui-context';

export type WalletUiDialogTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function SolanaWalletUiDialogTrigger(props: WalletUiDialogTriggerProps) {
    const { dialogApi } = useSolanaWalletUi();

    console.log('SolanaWalletUiDialogTrigger', dialogApi);
    return (
        <button {...props} {...dialogApi.getTriggerProps()}>
            Select Wallet
        </button>
    );
}
