import type { DevnetUrl, LocalnetUrl, MainnetUrl, TestnetUrl } from 'gill';

import { SolanaCluster } from './types/solana-cluster';

export type CreateSolanaProps = Partial<Pick<SolanaCluster, 'label' | 'urlOrMoniker'>> | string;

function createSolanaCluster<T extends DevnetUrl | LocalnetUrl | MainnetUrl | TestnetUrl>(
    props: CreateSolanaProps,
    { cluster, id, label, urlOrMoniker }: SolanaCluster,
): Pick<SolanaCluster, 'cluster' | 'id' | 'label' | 'urlOrMoniker'> {
    if (typeof props === 'string') {
        return { cluster, id, label, urlOrMoniker: props as T };
    }

    return { cluster, id, label: props.label ?? label, urlOrMoniker: props.urlOrMoniker ?? urlOrMoniker };
}

export function createSolanaDevnet(props: CreateSolanaProps = {}): SolanaCluster {
    return createSolanaCluster<DevnetUrl>(props, {
        cluster: 'devnet',
        id: 'solana:devnet',
        label: 'Devnet',
        urlOrMoniker: 'devnet' as DevnetUrl,
    });
}

export function createSolanaLocalnet(props: CreateSolanaProps = {}): SolanaCluster {
    return createSolanaCluster(props, {
        cluster: 'localnet',
        id: 'solana:local',
        label: 'Localnet',
        urlOrMoniker: 'localnet' as LocalnetUrl,
    });
}

export function createSolanaMainnet(props: CreateSolanaProps = {}): SolanaCluster {
    return createSolanaCluster(props, {
        cluster: 'mainnet',
        id: 'solana:mainnet',
        label: 'Mainnet',
        urlOrMoniker: 'mainnet' as MainnetUrl,
    });
}

export function createSolanaTestnet(props: CreateSolanaProps = {}): SolanaCluster {
    return createSolanaCluster(props, {
        cluster: 'testnet',
        id: 'solana:testnet',
        label: 'Testnet',
        urlOrMoniker: 'testnet' as TestnetUrl,
    });
}
