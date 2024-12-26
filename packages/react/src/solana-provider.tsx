import { SolanaChain } from '@wallet-ui/core';
import React, { ReactNode } from 'react';

import { SolanaChainProvider } from './solana-chain-provider';
import { SolanaRpcProvider } from './solana-rpc-provider';
import { SolanaWalletProvider } from './solana-wallet-provider';

export function SolanaProvider({ chains, children }: { chains: SolanaChain[]; children: ReactNode }) {
    return (
        <SolanaChainProvider chains={chains}>
            <SolanaRpcProvider>
                <SolanaWalletProvider>{children}</SolanaWalletProvider>
            </SolanaRpcProvider>
        </SolanaChainProvider>
    );
}
