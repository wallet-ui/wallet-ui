import { Commitment, Connection, ConnectionConfig } from '@solana/web3.js';
import { AppIdentity, Chain } from '@solana-mobile/mobile-wallet-adapter-protocol';
import React, { createContext, type ReactNode, useEffect, useMemo, useRef } from 'react';

import { createAsyncStorageCache } from './async-storage-cache';
import { AuthorizationStore, createAuthorizationStore } from './authorization-store';
import { WalletAuthorization, WalletAuthorizationCache, WalletAuthorizationProps } from './use-authorization';

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
    store: AuthorizationStore;
}

export const MobileWalletProviderContext = createContext<MobileWalletProviderState>({} as MobileWalletProviderState);
export function MobileWalletProvider({
    cache: userCache,
    children,
    chain,
    commitmentOrConfig = { commitment: 'confirmed' },
    endpoint,
    identity,
}: MobileWalletProviderProps) {
    const connection = useMemo(() => new Connection(endpoint, commitmentOrConfig), [commitmentOrConfig, endpoint]);
    const cache = useMemo(() => userCache ?? createAsyncStorageCache<WalletAuthorization>(), [userCache]);

    const storeRef = useRef<AuthorizationStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = createAuthorizationStore({ cache });
    }
    const store = storeRef.current;

    useEffect(() => {
        store.fetch().catch(console.error);
    }, [store]);

    return (
        <MobileWalletProviderContext.Provider
            value={useMemo(
                () => ({
                    cache,
                    chain,
                    connection,
                    identity,
                    store,
                }),
                [cache, chain, connection, identity, store],
            )}
        >
            {children}
        </MobileWalletProviderContext.Provider>
    );
}
