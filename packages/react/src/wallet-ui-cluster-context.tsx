import { SolanaCluster, SolanaClusterId } from '@wallet-ui/core';
import { createContext, ReactNode } from 'react';

export interface WalletUiClusterContextProviderProps {
    clusters: SolanaCluster[];
    render: (props: WalletUiClusterContextValue) => ReactNode;
    storageKey?: string;
}

export interface WalletUiClusterContextValue {
    cluster: SolanaCluster;
    clusters: SolanaCluster[];

    setCluster(cluster: SolanaClusterId): void;
}

export const WalletUiClusterContext = createContext<WalletUiClusterContextValue>({} as WalletUiClusterContextValue);
