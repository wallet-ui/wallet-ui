import { useStore } from '@nanostores/react';
import { createStorageCluster, SolanaClusterId } from '@wallet-ui/core';
import React from 'react';

import {
    WalletUiClusterContext,
    WalletUiClusterContextProviderProps,
    WalletUiClusterContextValue,
} from './wallet-ui-cluster-context';

export function WalletUiClusterContextProvider({
    clusters,
    render,
    storage = createStorageCluster(),
}: WalletUiClusterContextProviderProps) {
    const clusterId = useStore(storage.value);

    if (!clusters.length) {
        throw new Error('No clusters provided');
    }

    const found = clusters.find(c => c.id === clusterId);
    const first = clusters[0];

    const value: WalletUiClusterContextValue = {
        cluster: found ?? first,
        clusters,
        setCluster: (clusterId: SolanaClusterId) => {
            const cluster = clusters.find(c => c.id === clusterId);
            if (!cluster) {
                throw new Error(`Cluster ${clusterId} not found`);
            }
            storage.set(clusterId);
        },
    };

    return <WalletUiClusterContext.Provider value={value}>{render(value)}</WalletUiClusterContext.Provider>;
}
