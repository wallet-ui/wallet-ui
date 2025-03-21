import {
    clusterDevnet,
    clusterLocalnet,
    SolanaCluster,
    WalletUiClusterProvider,
    WalletUiProvider,
} from '@wallet-ui/react';
import React from 'react';

const clusters: SolanaCluster[] = [clusterDevnet(), clusterLocalnet()];

export function TestReactProviders({ children }: { children: React.ReactNode }) {
    return (
        <WalletUiClusterProvider clusters={clusters}>
            <WalletUiProvider size="md">{children}</WalletUiProvider>
        </WalletUiClusterProvider>
    );
}
