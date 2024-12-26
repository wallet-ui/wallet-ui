import {
    createSolanaRpc,
    createSolanaRpcSubscriptions,
    Rpc,
    RpcSubscriptions,
    SolanaRpcApiDevnet,
    SolanaRpcSubscriptionsApi,
} from '@solana/web3.js';

export type SolanaClient = {
    rpc: Rpc<SolanaRpcApiDevnet>;
    rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>;
};

export interface SolanaClientConfig {
    rpc: string;
    rpcSubscriptions?: string;
}

export function createSolanaClient(config: SolanaClientConfig): SolanaClient {
    const rpc = createSolanaRpc(config.rpc);
    const rpcSubscriptions = createSolanaRpcSubscriptions(
        // Figure out the subscriptions URL if it's not provided.
        config.rpcSubscriptions ?? config.rpc.replace('https', 'wss').replace('8899', '8900'),
    );
    return {
        rpc,
        rpcSubscriptions,
    };
}
