import { AppIdentity } from '@solana-mobile/mobile-wallet-adapter-protocol';
import { SolanaCluster } from '@wallet-ui/core';
import React, { createContext, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';

import { createAsyncStorageCache } from './async-storage-cache';
import { AuthorizationStore, createAuthorizationStore } from './authorization-store';
import type { BaseClient, Client } from './client';
import { createDefaultClient } from './create-default-client';
import type { MobileWalletConfig } from './mobile-wallet';
import { WalletAuthorization, WalletAuthorizationCache, WalletAuthorizationProps } from './use-authorization';

type ClientFactory<TClient extends BaseClient> = (
    cluster: { url: string; urlWs?: string },
    mobileWalletConfig: MobileWalletConfig,
) => TClient;
type MobileWalletProviderClientProps<TClient extends BaseClient> = Client extends TClient
    ? { createClient?: ClientFactory<TClient> }
    : { createClient: ClientFactory<TClient> };
export type MobileWalletProviderProps<TClient extends BaseClient = Client> =
    MobileWalletProviderClientProps<TClient> & {
        cache?: WalletAuthorizationCache;
        children: ReactNode;
        cluster: Pick<SolanaCluster, 'id' | 'url' | 'urlWs'>;
        identity: AppIdentity;
    };
export interface MobileWalletProviderState<TClient extends BaseClient = Client> extends WalletAuthorizationProps {
    client: TClient;
    store: AuthorizationStore;
}

export const MobileWalletProviderContext = createContext<MobileWalletProviderState<BaseClient>>(
    {} as MobileWalletProviderState<BaseClient>,
);
export function MobileWalletProvider<TClient extends BaseClient = Client>({
    cache: userCache,
    children,
    cluster,
    createClient,
    identity,
}: MobileWalletProviderProps<TClient>) {
    // Built lazily and kept in a ref so the default cache is created at most once, and only when no cache is provided.
    const defaultCache = useRef<WalletAuthorizationCache | undefined>(undefined);
    const cache = userCache ?? (defaultCache.current ??= createAsyncStorageCache<WalletAuthorization>());
    // Rebuild the store when `cache` changes so its state never diverges from the cache it reads and writes.
    const [storeState, setStoreState] = useState(() => ({ cache, store: createAuthorizationStore({ cache }) }));
    if (storeState.cache !== cache) {
        setStoreState({ cache, store: createAuthorizationStore({ cache }) });
    }
    const { store } = storeState;
    const mobileWalletConfig = useMemo(() => ({ chain: cluster.id, identity, store }), [cluster.id, identity, store]);
    const client = useMemo(
        () => (createClient ? createClient(cluster, mobileWalletConfig) : createDefaultClient(cluster)),
        // Keyed on the cluster fields the factories read, so an inline `cluster` literal does not rebuild the client
        // on every render. `cluster.id` reaches the factory through `mobileWalletConfig`.
        [createClient, cluster.url, cluster.urlWs, mobileWalletConfig],
    );

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
