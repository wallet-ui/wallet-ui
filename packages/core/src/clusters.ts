import { devnet, mainnet, testnet } from '@solana/kit';

import {
    localnet,
    SolanaCluster,
    SolanaDevnetUrl,
    SolanaLocalnetUrl,
    SolanaMainnetUrl,
    SolanaTestnetUrl,
} from './types/solana-cluster';

export type CreateSolanaProps = string | (Partial<Pick<SolanaCluster, 'label' | 'url' | 'urlWs'>> & { url: string });

function createSolanaCluster<T extends SolanaDevnetUrl | SolanaLocalnetUrl | SolanaMainnetUrl | SolanaTestnetUrl>(
    props: CreateSolanaProps,
    { id, label, url: defaultUrl, urlWs: defaultUrlWs }: Pick<SolanaCluster, 'id' | 'label' | 'url' | 'urlWs'>,
): SolanaCluster {
    if (typeof props === 'string') {
        return { id, label, url: props as T };
    }

    return {
        id,
        label: props.label ?? label,
        url: props.url ?? defaultUrl,
        urlWs: props.urlWs ?? defaultUrlWs,
    };
}

export function createSolanaDevnet(props: CreateSolanaProps = 'https://api.devnet.solana.com'): SolanaCluster {
    return createSolanaCluster<SolanaDevnetUrl>(props, {
        id: 'solana:devnet',
        label: 'Devnet',
        url: devnet(typeof props === 'string' ? props : props.url),
    });
}

export function createSolanaLocalnet(props: CreateSolanaProps = 'http://localhost:8899'): SolanaCluster {
    const url = typeof props === 'string' ? props : props.url;
    const urlWs = typeof props !== 'string' ? (props.urlWs ?? getLocalUrlWs(url)) : undefined;
    return createSolanaCluster(props, {
        id: 'solana:localnet',
        label: 'Localnet',
        url: localnet(url),
        urlWs,
    });
}

function getLocalUrlWs(url: string) {
    return url.endsWith(':8899') ? url.replace(':8899', ':8900').replace('http', 'ws') : undefined;
}
export function createSolanaMainnet(props: CreateSolanaProps): SolanaCluster {
    return createSolanaCluster(props, {
        id: 'solana:mainnet',
        label: 'Mainnet',
        url: mainnet(typeof props === 'string' ? props : props.url),
    });
}

export function createSolanaTestnet(props: CreateSolanaProps = 'https://api.testnet.solana.com'): SolanaCluster {
    return createSolanaCluster(props, {
        id: 'solana:testnet',
        label: 'Testnet',
        url: testnet(typeof props === 'string' ? props : props.url),
    });
}
