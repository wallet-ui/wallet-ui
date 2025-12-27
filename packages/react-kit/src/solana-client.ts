import type {
    ClusterUrl,
    Rpc,
    RpcSubscriptions,
    RpcTransportFromClusterUrl,
    SolanaRpcApiFromTransport,
    SolanaRpcSubscriptionsApi,
} from '@solana/kit';

export type SolanaRpcMethodsFromClusterUrl<T extends ClusterUrl> = SolanaRpcApiFromTransport<
    RpcTransportFromClusterUrl<T>
>;

export type SolanaClient<T extends ClusterUrl = string> = {
    rpc: Rpc<SolanaRpcMethodsFromClusterUrl<T>>;
    rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>;
};
