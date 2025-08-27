import {
    createSolanaDevnet,
    createSolanaLocalnet,
    createSolanaTestnet,
    createWalletUiConfig,
    WalletUi,
    WalletUiConfig,
} from '@wallet-ui/react';
import { WalletUiGillProvider } from '@wallet-ui/react-gill';
import React from 'react';

const playgroundConfig = createWalletUiConfig({
    clusters: [
        createSolanaDevnet(),
        // Customize the clusters here
        createSolanaLocalnet({ url: 'http://localhost:8899' }),
        createSolanaTestnet('testnet'),
        // Enable mainnet when it's ready.
        // You will need a custom RPC URL for mainnet as the public RPC url can't be used for production.
        // clusterMainnet('https://mainnet.your-fast-rpc.com/?api-key=s3cr3t'),
    ],
});

export function PlaygroundProviders({
    children,
    config = playgroundConfig,
}: {
    children: React.ReactNode;
    config?: WalletUiConfig;
}) {
    return (
        <WalletUi config={config}>
            <WalletUiGillProvider>{children}</WalletUiGillProvider>
        </WalletUi>
    );
}
