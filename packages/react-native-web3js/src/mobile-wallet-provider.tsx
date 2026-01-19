import { Commitment, Connection, ConnectionConfig } from '@solana/web3.js';
import { AppIdentity, Chain } from '@solana-mobile/mobile-wallet-adapter-protocol';
import React, { createContext, type ReactNode, useMemo } from 'react';

import { WalletAuthorizationCache, WalletAuthorizationProps } from './use-authorization';

export interface MobileWalletProviderProps {
    cache?: WalletAuthorizationCache;
    chain: Chain;
    children: ReactNode;
    commitmentOrConfig?: Commitment | ConnectionConfig;
    endpoint: string;
    identity: AppIdentity;
}
export interface MobileWalletProviderState extends WalletAuthorizationProps {
    connection: Connection;
}

export const MobileWalletProviderContext = createContext<MobileWalletProviderState>({} as MobileWalletProviderState);
export function MobileWalletProvider({
    cache,
    children,
    chain,
    commitmentOrConfig = { commitment: 'confirmed' },
    endpoint,
    identity,
}: MobileWalletProviderProps) {
    const connection = useMemo(() => new Connection(endpoint, commitmentOrConfig), [commitmentOrConfig, endpoint]);

    return (
        <MobileWalletProviderContext.Provider
            value={useMemo(
                () => ({
                    cache,
                    chain,
                    connection,
                    identity,
                }),
                [cache, chain, connection, identity],
            )}
        >
            {children}
        </MobileWalletProviderContext.Provider>
    );
}
