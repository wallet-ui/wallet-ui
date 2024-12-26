import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/web3.js';
import React, { ReactNode, useMemo } from 'react';

import { useSolanaChain } from './solana-chain-context';
import { SolanaRpc, SolanaRpcContext } from './solana-rpc-context';

type Props = Readonly<{
    children: ReactNode;
}>;

export function SolanaRpcProvider({ children }: Props) {
    const { chain } = useSolanaChain();

    return (
        <SolanaRpcContext.Provider
            value={useMemo(
                () => ({
                    rpc: createSolanaRpc(chain.rpcUrl) as SolanaRpc,
                    rpcSubscriptions: createSolanaRpcSubscriptions(
                        chain.rpcSubscriptionsUrl
                            ? chain.rpcSubscriptionsUrl
                            : chain.rpcUrl.replace('https', 'wss').replace('8899', '8900'),
                    ),
                }),
                [chain],
            )}
        >
            {children}
        </SolanaRpcContext.Provider>
    );
}
