import { Connection } from '@solana/web3.js';
import React, { createContext, type ReactNode, useContext, useMemo } from 'react';
import { useNetwork } from '@/features/network/network-provider';
import { Network } from '@/features/network/network';

export interface SolanaProviderState {
    connection: Connection;
    network: Network;
}

const ConnectionContext = createContext<SolanaProviderState>({} as SolanaProviderState);
export function SolanaProvider({ children }: { children: ReactNode }) {
    const { selectedNetwork: network } = useNetwork();
    const connection = useMemo(() => new Connection(network.endpoint, { commitment: 'confirmed' }), [network.endpoint]);

    return <ConnectionContext.Provider value={{ connection, network }}>{children}</ConnectionContext.Provider>;
}

export function useSolana(): SolanaProviderState {
    return useContext(ConnectionContext);
}

export function useConnection(): Connection {
    return useSolana().connection;
}
