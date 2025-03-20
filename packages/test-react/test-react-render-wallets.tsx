import { WalletUiWallet } from '@wallet-ui/react/src';
import React from 'react';
import { useTestWallets } from './test-wallets';

export function TestReactRenderWallets(props: { render: (wallet: WalletUiWallet) => React.ReactNode }) {
    const wallets = useTestWallets();

    return wallets.map(wallet => props.render(wallet));
}