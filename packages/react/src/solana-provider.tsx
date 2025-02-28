import { SolanaCluster } from '@wallet-ui/core';
import React, { ReactNode } from 'react';

import { SolanaClientProvider } from './solana-client-provider';
import { useSolanaCluster } from './solana-cluster-context';
import { SolanaClusterProvider } from './solana-cluster-provider';
import { SolanaWalletProvider } from './solana-wallet-provider';
import { SolanaWalletUiProvider } from './solana-wallet-ui-provider';

export function SolanaProvider({ clusters, children }: { children: ReactNode; clusters: SolanaCluster[] }) {
    return (
        <SolanaClusterProvider clusters={clusters}>
            <SolanaClientProviderLoader>
                <SolanaWalletProvider>
                    <SolanaWalletUiProvider>{children}</SolanaWalletUiProvider>
                </SolanaWalletProvider>
            </SolanaClientProviderLoader>
        </SolanaClusterProvider>
    );
}

function SolanaClientProviderLoader({ children }: { children: ReactNode }) {
    const { cluster } = useSolanaCluster();

    return <SolanaClientProvider urlOrMoniker={cluster.urlOrMoniker}>{children}</SolanaClientProvider>;
}
