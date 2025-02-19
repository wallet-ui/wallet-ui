import { clusterDevnet, clusterLocalnet, clusterTestnet, SolanaCluster } from '@wallet-ui/core';
import { SolanaProvider } from '@wallet-ui/react';
import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

const clusters: SolanaCluster[] = [
    clusterDevnet(),
    // Customize the clusters here
    clusterLocalnet({ rpcUrl: 'http://localhost:8899' }),
    clusterTestnet(),
    // Enable mainnet when it's ready.
    // You will need a custom RPC URL for mainnet as the public RPC url can't be used for production.
    // clusterMainnet(),
];

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <BrowserRouter>
            <SolanaProvider clusters={clusters}>{children}</SolanaProvider>
        </BrowserRouter>
    );
}
