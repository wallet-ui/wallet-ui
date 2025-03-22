import { SolanaCluster, SolanaClusterId } from '@wallet-ui/core';
import { createContext, ReactNode } from 'react';

export interface WalletUiClusterContextProviderProps {
    children: ReactNode;
    clusters: SolanaCluster[];
    storageKey?: string;
}

export interface WalletUiClusterContextValue {
    cluster: SolanaCluster;
    clusters: SolanaCluster[];

    setCluster(cluster: SolanaClusterId): void;
}

export const WalletUiClusterContext = createContext<WalletUiClusterContextValue>({} as WalletUiClusterContextValue);
