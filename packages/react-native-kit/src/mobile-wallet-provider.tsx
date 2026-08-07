import { AppIdentity } from '@solana-mobile/mobile-wallet-adapter-protocol';
import { SolanaCluster } from '@wallet-ui/core';
import React, { createContext, type ReactNode, useEffect, useMemo, useState } from 'react';

import { createAsyncStorageCache } from './async-storage-cache';
import { AuthorizationStore, createAuthorizationStore } from './authorization-store';
import type { BaseClient, Client } from './client';
import { createDefaultClient } from './create-default-client';
import { WalletAuthorization, WalletAuthorizationCache, WalletAuthorizationProps } from './use-authorization';

type ClientFactory<TClient extends BaseClient> = (cluster: { url: string; urlWs?: string }) => TClient;
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
    const cache = useMemo(() => userCache ?? createAsyncStorageCache<WalletAuthorization>(), [userCache]);
    const client = useMemo(
        () => (createClient ? createClient(cluster) : createDefaultClient(cluster)),
        [createClient, cluster],
    );

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
