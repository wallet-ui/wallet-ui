import { SolanaCluster } from '@wallet-ui/core';
import { createContext, useContext } from 'react';

export type SolanaClusterContextProps = Readonly<{
    cluster: SolanaCluster;
    clusters: SolanaCluster[];
    setCluster?(cluster: `solana:${string}`): void;
}>;

export const SolanaClusterContext = createContext<SolanaClusterContextProps>({} as SolanaClusterContextProps);

export function useSolanaCluster() {
    return useContext(SolanaClusterContext);
}
