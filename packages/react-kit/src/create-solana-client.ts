import type { ClusterUrl } from '@solana/kit';
import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit';

import type { SolanaClient } from './solana-client.ts';

export interface CreateSolanaClientOptions<T extends ClusterUrl> {
    http: T;
    httpOptions?: Parameters<typeof createSolanaRpc<T>>[1];
    ws?: T | undefined;
    wsOptions?: Parameters<typeof createSolanaRpcSubscriptions<T>>[1];
}

export function createSolanaClient<T extends ClusterUrl>({
    http,
    httpOptions,
    ws,
    wsOptions,
}: CreateSolanaClientOptions<T>): SolanaClient<T> {
    if (!http.startsWith('http')) {
        throw new Error('Invalid url');
    }
    if (ws?.trim().length && !ws.startsWith('ws')) {
        throw new Error('Invalid subscription url');
    }
    const rpcSubscriptionsUrl = ws?.length ? ws : http.replace('http', 'ws');

    return {
        rpc: createSolanaRpc(http, httpOptions),
        rpcSubscriptions: createSolanaRpcSubscriptions(rpcSubscriptionsUrl, wsOptions),
    };
}
