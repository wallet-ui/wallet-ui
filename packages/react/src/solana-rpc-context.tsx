import type { Rpc, RpcSubscriptions, SolanaRpcApiDevnet, SolanaRpcSubscriptionsApi } from 'gill';
import { createSolanaRpc, createSolanaRpcSubscriptions, devnet } from 'gill';
import { createContext, useContext } from 'react';

export type SolanaRpc = Rpc<SolanaRpcApiDevnet>;

export const SolanaRpcContext = createContext<{
    rpc: SolanaRpc; // Limit the API to only those methods found on Mainnet (ie. not `requestAirdrop`)
    rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>;
}>({
    rpc: createSolanaRpc(devnet('https://api.devnet.solana.com')),
    rpcSubscriptions: createSolanaRpcSubscriptions(devnet('wss://api.devnet.solana.com')),
});

export function useSolanaRpc() {
    return useContext(SolanaRpcContext);
}
