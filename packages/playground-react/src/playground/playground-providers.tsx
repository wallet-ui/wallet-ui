import {
    createSolanaDevnet,
    createSolanaLocalnet,
    createSolanaTestnet,
    createWalletUiConfig,
    WalletUi,
} from '@wallet-ui/react';
import React from 'react';
import { SolanaClientProvider } from './solana-client-provider';

const config = createWalletUiConfig({
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

export function PlaygroundProviders({ children }: { children: React.ReactNode }) {
    return (
        <WalletUi config={config}>
            <SolanaClientProvider>{children}</SolanaClientProvider>
        </WalletUi>
    );
}
