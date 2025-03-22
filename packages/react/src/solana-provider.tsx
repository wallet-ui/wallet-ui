import { SolanaCluster } from '@wallet-ui/core';
import React, { ReactNode } from 'react';

import { SolanaWalletProvider } from './solana-wallet-provider';
import { SolanaWalletUiProvider } from './solana-wallet-ui-provider';
import { useWalletUiCluster } from './use-wallet-ui-cluster';
import { WalletUiClientProvider } from './wallet-ui-client-provider';
import { WalletUiClusterProvider } from './wallet-ui-cluster-provider';

export function SolanaProvider({ clusters, children }: { children: ReactNode; clusters: SolanaCluster[] }) {
    return (
        <WalletUiClusterProvider clusters={clusters}>
            <WalletUiClientProviderFromCluster>
                <SolanaWalletProvider>
                    <SolanaWalletUiProvider>{children}</SolanaWalletUiProvider>
                </SolanaWalletProvider>
            </WalletUiClientProviderFromCluster>
        </WalletUiClusterProvider>
    );
}

function WalletUiClientProviderFromCluster({ children }: { children: ReactNode }) {
    const { cluster } = useWalletUiCluster();

    return <WalletUiClientProvider urlOrMoniker={cluster.urlOrMoniker}>{children}</WalletUiClientProvider>;
}
