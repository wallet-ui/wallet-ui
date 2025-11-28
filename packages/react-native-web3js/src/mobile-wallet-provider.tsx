import { Connection } from '@solana/web3.js';
import { AppIdentity, Chain } from '@solana-mobile/mobile-wallet-adapter-protocol';
import React, { createContext, type ReactNode, useMemo } from 'react';

export interface MobileWalletProviderProps {
    chain: Chain;
    children: ReactNode;
    endpoint: string;
    identity: AppIdentity;
}
export interface MobileWalletProviderState {
    chain: Chain;
    connection: Connection;
    identity: AppIdentity;
}

export const MobileWalletProviderContext = createContext<MobileWalletProviderState>({} as MobileWalletProviderState);
export function MobileWalletProvider({ children, chain, endpoint, identity }: MobileWalletProviderProps) {
    const connection = useMemo(() => new Connection(endpoint, { commitment: 'confirmed' }), [endpoint]);

    return (
        <MobileWalletProviderContext.Provider
            value={useMemo(
                () => ({
                    chain,
                    connection,
                    identity,
                }),
                [connection, identity, chain],
            )}
        >
            {children}
        </MobileWalletProviderContext.Provider>
    );
}
