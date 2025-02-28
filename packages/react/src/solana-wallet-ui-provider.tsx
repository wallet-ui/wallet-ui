import React, { ReactNode } from 'react';

import { SolanaWalletUiContext, SolanaWalletUiProviderContext } from './solana-wallet-ui-context';

export function SolanaWalletUiProvider(props: { children: ReactNode }) {
    const value: SolanaWalletUiProviderContext = {
        name: 'Wallet UI',
    };

    return <SolanaWalletUiContext.Provider value={value}>{props.children}</SolanaWalletUiContext.Provider>;
}
