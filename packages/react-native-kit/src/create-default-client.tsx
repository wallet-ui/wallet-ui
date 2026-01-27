import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit';

import { Client } from './client';

export function createDefaultClient(cluster: { url: string; urlWs?: string }): Client {
    const rpc = createSolanaRpc(cluster.url);
    const rpcSubscriptionsUrl = cluster.urlWs ?? cluster.url.replace(/^http/, 'ws');
    const rpcSubscriptions = createSolanaRpcSubscriptions(rpcSubscriptionsUrl);
    return { rpc, rpcSubscriptions };
}
