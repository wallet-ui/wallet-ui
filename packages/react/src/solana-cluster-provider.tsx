import { SolanaCluster } from '@wallet-ui/core';
import React, { ReactNode, useMemo } from 'react';

import { SolanaClusterContext } from './solana-cluster-context';
import { useLocalStorage } from './use-local-storage';

const STORAGE_KEY = 'placeholder:selected-cluster';

export function SolanaClusterProvider({ clusters, children }: { children: ReactNode, clusters: SolanaCluster[]; }) {
    const [clusterId, setClusterId] = useLocalStorage(STORAGE_KEY, 'solana:devnet');

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

    return (
        <SolanaClusterContext.Provider
            value={useMemo(
                () => ({
                    cluster,
                    clusters,
                    setCluster(cluster) {
                        localStorage.setItem(STORAGE_KEY, cluster);
                        setClusterId(cluster);
                    },
                }),
                [cluster, clusters],
            )}
        >
            {children}
        </SolanaClusterContext.Provider>
    );
}
