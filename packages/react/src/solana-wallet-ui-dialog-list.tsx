import React from 'react';

import { useSolanaWalletUi } from './solana-wallet-ui-context';
import { SolanaWalletUiDialogListItem } from './solana-wallet-ui-dialog-list-item';

export function SolanaWalletUiDialogList() {
    const { wallets } = useSolanaWalletUi();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {wallets.map((item, index) => (
                <SolanaWalletUiDialogListItem key={`${item.name}-${index}`} wallet={item} />
            ))}
        </div>
    );
}
