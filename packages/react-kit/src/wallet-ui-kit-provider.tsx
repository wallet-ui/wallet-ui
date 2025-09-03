import { ClusterUrl, createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit';
import { useWalletUiCluster } from '@wallet-ui/react';
import React, { ReactNode, useMemo } from 'react';

import { WalletUiKitContext } from './wallet-ui-kit-context';

export interface CreateClientOptions {
    url: ClusterUrl;
    urlSubscriptions?: ClusterUrl;
}

export type Client = ReturnType<typeof createClient>;

export function createClient({ url, urlSubscriptions }: CreateClientOptions) {
    const rpc = createSolanaRpc(url);
    const rpcSubscriptions = createSolanaRpcSubscriptions(urlSubscriptions ?? url.replace('http', 'ws'));

    return {
        rpc,
        rpcSubscriptions,
    };
}

export function WalletUiKitProvider({
    children,
    url,
    urlSubscriptions,
}: CreateClientOptions & {
    children: ReactNode;
}) {
    const { cluster } = useWalletUiCluster();
    const clusterUrl = useMemo(() => url ?? cluster.url, [cluster.url, url]);
    const value = useMemo(() => createClient({ url: clusterUrl, urlSubscriptions }), [clusterUrl, urlSubscriptions]);
    return <WalletUiKitContext.Provider value={value}>{children}</WalletUiKitContext.Provider>;
}
