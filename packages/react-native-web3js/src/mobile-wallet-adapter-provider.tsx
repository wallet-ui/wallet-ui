import { Connection } from '@solana/web3.js';
import { AppIdentity } from '@solana-mobile/mobile-wallet-adapter-protocol';
import { SolanaClusterId } from '@wallet-ui/core/src';
import React, { createContext, type ReactNode, useMemo } from 'react';

export interface MobileWalletAdapterProviderProps {
    children: ReactNode;
    clusterId: SolanaClusterId;
    endpoint: string;
    identity: AppIdentity;
}
export interface MobileWalletAdapterProviderState {
    clusterId: SolanaClusterId;
    connection: Connection;
    identity: AppIdentity;
}

export const MobileWalletAdapterProviderContext = createContext<MobileWalletAdapterProviderState>(
    {} as MobileWalletAdapterProviderState,
);
export function MobileWalletAdapterProvider({
    children,
    clusterId,
    endpoint,
    identity,
}: MobileWalletAdapterProviderProps) {
    const connection = useMemo(() => new Connection(endpoint, { commitment: 'confirmed' }), [endpoint]);
    const value = useMemo(() => ({ clusterId, connection, identity }), [connection, identity, clusterId]);

    return (
        <MobileWalletAdapterProviderContext.Provider value={value}>
            {children}
        </MobileWalletAdapterProviderContext.Provider>
    );
}
