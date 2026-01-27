import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit';

export interface Client {
    rpc: ReturnType<typeof createSolanaRpc>;
    rpcSubscriptions: ReturnType<typeof createSolanaRpcSubscriptions>;
}
