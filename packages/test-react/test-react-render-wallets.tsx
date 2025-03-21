import { UiWallet } from '@wallet-ui/react';
import React from 'react';
import { useTestWallets } from './test-wallets';

export function TestReactRenderWallets(props: { render: (wallet: UiWallet) => React.ReactNode }) {
    const wallets = useTestWallets();

    return wallets.map(wallet => props.render(wallet));
}
