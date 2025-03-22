import {
    createSolanaDevnet,
    createSolanaLocalnet,
    createSolanaTestnet,
    WalletUi,
    WalletUiConfig,
} from '@wallet-ui/react';
import React from 'react';

export function getPlaygroundConfig(): WalletUiConfig {
    return {
        clusters: [
            createSolanaDevnet(),
            // Customize the clusters here
            createSolanaLocalnet({ urlOrMoniker: 'http://localhost:8899' }),
            createSolanaTestnet(),
            // Enable mainnet when it's ready.
            // You will need a custom RPC URL for mainnet as the public RPC url can't be used for production.
            // clusterMainnet(),
        ],
    };
}

export function PlaygroundProviders({
    children,
    config = getPlaygroundConfig(),
}: {
    children: React.ReactNode;
    config?: WalletUiConfig;
}) {
    return <WalletUi config={config}>{children}</WalletUi>;
}
