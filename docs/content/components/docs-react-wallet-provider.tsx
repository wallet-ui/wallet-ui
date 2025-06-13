'use client';
import {
    createSolanaDevnet,
    createSolanaLocalnet,
    createSolanaTestnet,
    createWalletUiConfig,
    WalletUi,
    WalletUiConfig,
} from '@wallet-ui/react';
import React from 'react';

const config: WalletUiConfig = createWalletUiConfig({
    clusters: [
        createSolanaDevnet(),
        createSolanaLocalnet(),
        createSolanaTestnet(),
        // Enable mainnet when you're ready.
        // You will need to use a custom RPC URL for mainnet. The public mainnet RPC url can't be used for production.
        // clusterMainnet('https://mainnet.custom-rpc.com/?api-key=s0m3-l0ng-4ss-4p1-s3cr3t'),
    ],
});

export function DocsReactWalletProvider({ children }: { children: React.ReactNode }) {
    return <WalletUi config={config}>{children}</WalletUi>;
}
