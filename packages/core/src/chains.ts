import { ClusterUrl, devnet, mainnet, testnet } from '@solana/web3.js';

export type SolanaChainId = `solana:${string}`;

export interface SolanaChain {
    id: SolanaChainId;
    label: string;
    rpcSubscriptionsUrl?: ClusterUrl;
    rpcUrl: ClusterUrl;
}

export function chainDevnet(props: Partial<SolanaChain> = {}): SolanaChain {
    return Object.freeze({
        id: props.id ?? 'solana:devnet',
        label: props.label ?? 'Devnet',
        rpcSubscriptionsUrl: props.rpcSubscriptionsUrl ?? devnet('wss://api.devnet.solana.com'),
        rpcUrl: props.rpcUrl ?? devnet('https://api.devnet.solana.com'),
    });
}

export function chainLocal(props: Partial<SolanaChain> = {}): SolanaChain {
    return Object.freeze({
        id: props.id ?? 'solana:local',
        label: props.label ?? 'Local',
        rpcSubscriptionsUrl: props.rpcSubscriptionsUrl ?? devnet('ws://localhost:8900'),
        rpcUrl: props.rpcUrl ?? devnet('http://localhost:8899'),
    });
}

export function chainMainnet(props: Partial<SolanaChain> = {}): SolanaChain {
    return Object.freeze({
        id: props.id ?? 'solana:mainnet',
        label: props.label ?? 'Mainnet',
        rpcSubscriptionsUrl: props.rpcSubscriptionsUrl ?? mainnet('wss://api.mainnet-beta.solana.com'),
        rpcUrl: props.rpcUrl ?? mainnet('https://api.mainnet-beta.solana.com'),
    });
}

export function chainTestnet(props: Partial<SolanaChain> = {}): SolanaChain {
    return Object.freeze({
        id: props.id ?? 'solana:testnet',
        label: props.label ?? 'Testnet',
        rpcSubscriptionsUrl: props.rpcSubscriptionsUrl ?? testnet('wss://api.testnet.solana.com'),
        rpcUrl: props.rpcUrl ?? testnet('https://api.testnet.solana.com'),
    });
}
