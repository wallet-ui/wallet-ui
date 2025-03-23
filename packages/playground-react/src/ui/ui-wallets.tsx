import { UiWallet } from '@wallet-ui/react';
import React from 'react';
import { useTestWallets } from '../util/test-wallets';

export function UiWallets(props: { render: (wallet: UiWallet) => React.ReactNode }) {
    const wallets = useTestWallets();

    return wallets.map(wallet => props.render(wallet));
}
