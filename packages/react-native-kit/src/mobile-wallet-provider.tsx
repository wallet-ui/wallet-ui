import { AppIdentity } from '@solana-mobile/mobile-wallet-adapter-protocol';
import { SolanaCluster } from '@wallet-ui/core';
import React, { createContext, type ReactNode, useEffect, useMemo, useState } from 'react';

import { createAsyncStorageCache } from './async-storage-cache';
import { AuthorizationStore, createAuthorizationStore } from './authorization-store';
import { Client } from './client';
import { createDefaultClient } from './create-default-client';
import { WalletAuthorization, WalletAuthorizationCache, WalletAuthorizationProps } from './use-authorization';

export interface MobileWalletProviderProps {
    cache?: WalletAuthorizationCache;
    children: ReactNode;
    cluster: Pick<SolanaCluster, 'id' | 'url' | 'urlWs'>;
    createClient?: (cluster: { url: string; urlWs?: string }) => Client;
    identity: AppIdentity;
}
export interface MobileWalletProviderState extends WalletAuthorizationProps {
    client: Client;
    store: AuthorizationStore;
}

export const MobileWalletProviderContext = createContext<MobileWalletProviderState>({} as MobileWalletProviderState);
export function MobileWalletProvider({
    cache: userCache,
    children,
    cluster,
    createClient = createDefaultClient,
    identity,
}: MobileWalletProviderProps) {
    const cache = useMemo(() => userCache ?? createAsyncStorageCache<WalletAuthorization>(), [userCache]);
    const client = useMemo(() => createClient(cluster), [createClient, cluster]);

    const [store] = useState(() => createAuthorizationStore({ cache }));

    useEffect(() => {
        store.fetch().catch(console.error);
    }, [store]);

    return (
        <MobileWalletProviderContext.Provider
            value={useMemo(
                () => ({
                    cache,
                    chain: cluster.id,
                    client,
                    identity,
                    store,
                }),
                [cache, cluster.id, client, identity, store],
            )}
        >
            {children}
        </MobileWalletProviderContext.Provider>
    );
}
