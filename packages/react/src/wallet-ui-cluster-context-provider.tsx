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
    if (!clusterId) {
        throw new Error('Error reading cluster id from storage');
    }
    if (!clusters.length) {
        throw new Error('No clusters provided');
    }

    const cluster = clusters.find(c => c.id === clusterId);
    if (!cluster) {
        throw new Error(`Cluster ${clusterId.toString()} not found`);
    }

    const value: WalletUiClusterContextValue = {
        cluster,
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
