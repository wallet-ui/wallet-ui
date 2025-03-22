import type { SolanaClusterMoniker } from 'gill';

import { SolanaClientUrlOrMoniker } from './types/solana-client';

export type SolanaClusterId = `solana:${string}`;

export interface SolanaCluster {
    cluster: SolanaClusterMoniker;
    id: SolanaClusterId;
    label: string;
    urlOrMoniker: SolanaClientUrlOrMoniker;
}

export type CreateSolanaClusterProps = Pick<SolanaCluster, 'id' | 'label' | 'urlOrMoniker'>;

export function createSolanaCluster(cluster: SolanaClusterMoniker, props: CreateSolanaClusterProps): SolanaCluster {
    return Object.freeze({
        cluster,
        id: props.id,
        label: props.label,
        urlOrMoniker: props.urlOrMoniker,
    });
}

export type CreateSolanaProps = Partial<Pick<SolanaCluster, 'label' | 'urlOrMoniker'>>;

export function createSolanaDevnet(props: CreateSolanaProps = {}): SolanaCluster {
    return createSolanaCluster('devnet', {
        id: 'solana:devnet',
        label: props.label ?? 'Devnet',
        urlOrMoniker: props.urlOrMoniker ?? 'devnet',
    });
}

export function createSolanaLocalnet(props: CreateSolanaProps = {}): SolanaCluster {
    return createSolanaCluster('localnet', {
        id: 'solana:local',
        label: props.label ?? 'Local',
        urlOrMoniker: props.urlOrMoniker ?? 'localnet',
    });
}

export function createSolanaMainnet(props: CreateSolanaProps = {}): SolanaCluster {
    return createSolanaCluster('mainnet', {
        id: 'solana:mainnet',
        label: props.label ?? 'Mainnet',
        urlOrMoniker: props.urlOrMoniker ?? 'mainnet',
    });
}

export function createSolanaTestnet(props: CreateSolanaProps = {}): SolanaCluster {
    return createSolanaCluster('testnet', {
        id: 'solana:testnet',
        label: props.label ?? 'Testnet',
        urlOrMoniker: props.urlOrMoniker ?? 'testnet',
    });
}
