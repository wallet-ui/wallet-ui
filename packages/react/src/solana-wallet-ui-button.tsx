import React from 'react';

import { useSolanaWalletUi } from './solana-wallet-ui-context';
import { SolanaWalletUiDialogTrigger } from './solana-wallet-ui-dialog-trigger';
import { SolanaWalletUiDropdown } from './solana-wallet-ui-dropdown';

export function SolanaWalletUiButton() {
    const { connected } = useSolanaWalletUi();

    return connected ? <SolanaWalletUiDropdown /> : <SolanaWalletUiDialogTrigger />;
}
