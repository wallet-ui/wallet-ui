import { Connection } from '@solana/web3.js';
import { AppIdentity } from '@solana-mobile/mobile-wallet-adapter-protocol';
import { SolanaClusterId } from '@wallet-ui/core/src';
import React, { createContext, type ReactNode, useMemo } from 'react';

export interface SolanaMobileProviderProps {
    children: ReactNode;
    clusterId: SolanaClusterId;
    endpoint: string;
    identity: AppIdentity;
}
export interface SolanaMobileProviderState {
    clusterId: SolanaClusterId;
    connection: Connection;
    identity: AppIdentity;
}

export const SolanaMobileProviderContext = createContext<SolanaMobileProviderState>({} as SolanaMobileProviderState);
export function SolanaMobileProvider({ children, clusterId, endpoint, identity }: SolanaMobileProviderProps) {
    const connection = useMemo(() => new Connection(endpoint, { commitment: 'confirmed' }), [endpoint]);
    const value = useMemo(() => ({ clusterId, connection, identity }), [connection, identity, clusterId]);

    return <SolanaMobileProviderContext.Provider value={value}>{children}</SolanaMobileProviderContext.Provider>;
}
