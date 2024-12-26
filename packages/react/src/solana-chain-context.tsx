import { devnet, testnet } from '@solana/web3.js';
import { SolanaChain } from '@wallet-ui/core';
import { createContext, useContext } from 'react';

export type SolanaChainContextProps = Readonly<{
    chain: SolanaChain;
    chains: SolanaChain[];
    setChain?(chain: `solana:${string}`): void;
}>;

export const CHAIN_CONFIG_DEVNET: SolanaChain = Object.freeze({
    id: 'solana:devnet',
    label: 'Devnet',
    rpcSubscriptionsUrl: devnet('wss://api.devnet.solana.com'),
    rpcUrl: devnet('https://api.devnet.solana.com'),
});
export const CHAIN_CONFIG_LOCAL: SolanaChain = Object.freeze({
    id: 'solana:local',
    label: 'Local',
    rpcSubscriptionsUrl: 'ws://localhost:8900',
    rpcUrl: 'http://localhost:8899',
});
export const CHAIN_CONFIG_TESTNET: SolanaChain = Object.freeze({
    id: 'solana:testnet',
    label: 'Testnet',
    rpcSubscriptionsUrl: testnet('wss://api.testnet.solana.com'),
    rpcUrl: testnet('https://api.testnet.solana.com'),
});

export const SolanaChainContext = createContext<SolanaChainContextProps>({} as SolanaChainContextProps);

export function useSolanaChain() {
    return useContext(SolanaChainContext);
}
