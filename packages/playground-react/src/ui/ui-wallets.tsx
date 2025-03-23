import { UiWallet, useWalletUi } from '@wallet-ui/react';
import React from 'react';

export function UiWallets(props: { render: (wallet: UiWallet) => React.ReactNode }) {
    const { wallets } = useWalletUi();

    return wallets.map(wallet => props.render(wallet));
}
