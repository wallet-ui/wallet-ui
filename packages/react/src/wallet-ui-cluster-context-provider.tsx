import { SolanaCluster, SolanaClusterId } from '@wallet-ui/core';
import React, { useMemo } from 'react';

import { useLocalStorage } from './use-local-storage';
import {
    WalletUiClusterContext,
    WalletUiClusterContextProviderProps,
    WalletUiClusterContextValue,
} from './wallet-ui-cluster-context';

export function WalletUiClusterContextProvider({
    clusters,
    children,
    storageKey = '__wallet-ui:selected-cluster',
}: WalletUiClusterContextProviderProps) {
    const [clusterId, setClusterId] = useLocalStorage(storageKey, 'solana:devnet');
    if (!clusters.length) {
        throw new Error('No clusters provided');
    }
    const cluster = useMemo<SolanaCluster>(() => {
        for (const cluster of clusters) {
            if (cluster.id === clusterId) {
                return cluster;
            }
        }
        return clusters[0];
    }, [clusterId, clusters]);

    const value: WalletUiClusterContextValue = {
        cluster,
        clusters,
        setCluster: (cluster: SolanaClusterId) => {
            localStorage.setItem(storageKey, cluster);
            setClusterId(cluster);
        },
    };

    return <WalletUiClusterContext.Provider value={value}>{children}</WalletUiClusterContext.Provider>;
}
