import { SolanaClientUrlOrMoniker } from './types/solana-client';

export type SolanaClusterId = `solana:${string}`;

export interface SolanaCluster {
    id: SolanaClusterId;
    label: string;
    urlOrMoniker: SolanaClientUrlOrMoniker;
}

export function clusterDevnet(props: Partial<SolanaCluster> = {}): SolanaCluster {
    return Object.freeze({
        id: props.id ?? 'solana:devnet',
        label: props.label ?? 'Devnet',
        urlOrMoniker: 'devnet',
    });
}

export function clusterLocalnet(props: Partial<SolanaCluster> = {}): SolanaCluster {
    return Object.freeze({
        id: props.id ?? 'solana:local',
        label: props.label ?? 'Local',
        urlOrMoniker: 'localnet',
    });
}

export function clusterMainnet(props: Partial<SolanaCluster> = {}): SolanaCluster {
    return Object.freeze({
        id: props.id ?? 'solana:mainnet',
        label: props.label ?? 'Mainnet',
        urlOrMoniker: 'mainnet',
    });
}

export function clusterTestnet(props: Partial<SolanaCluster> = {}): SolanaCluster {
    return Object.freeze({
        id: props.id ?? 'solana:testnet',
        label: props.label ?? 'Testnet',
        urlOrMoniker: 'testnet',
    });
}
