import { devnet, mainnet, testnet } from '@solana/kit';

import type {
    SolanaCluster,
    SolanaDevnetUrl,
    SolanaLocalnetUrl,
    SolanaMainnetUrl,
    SolanaTestnetUrl,
} from './types/solana-cluster';

export type CreateSolanaProps =
    | string
    | (Partial<Pick<SolanaCluster, 'http' | 'label' | 'url' | 'ws'>> & { http: string });

function createSolanaCluster<T extends SolanaDevnetUrl | SolanaLocalnetUrl | SolanaMainnetUrl | SolanaTestnetUrl>(
    props: CreateSolanaProps,
    { id, label, http: defaultHttp, ws: defaultWs }: { http: T; id: SolanaCluster['id']; label: string; ws?: string },
): SolanaCluster {
    if (typeof props === 'string') {
        const http = props as T;
        return { http, id, label, url: http };
    }

    const httpUrl = props.http ?? props.url ?? defaultHttp;
    return {
        http: httpUrl,
        id,
        label: props.label ?? label,
        url: httpUrl,
        ws: props.ws ?? defaultWs,
    };
}

export function createSolanaDevnet(props: CreateSolanaProps = 'https://api.devnet.solana.com'): SolanaCluster {
    return createSolanaCluster<SolanaDevnetUrl>(props, {
        http: devnet(typeof props === 'string' ? props : props.http),
        id: 'solana:devnet',
        label: 'Devnet',
    });
}

export function createSolanaLocalnet(props: CreateSolanaProps = 'http://localhost:8899'): SolanaCluster {
    return createSolanaCluster(props, {
        http: devnet(typeof props === 'string' ? props : props.http),
        id: 'solana:localnet',
        label: 'Localnet',
        ws: 'ws://localhost:8900',
    });
}

export function createSolanaMainnet(props: CreateSolanaProps): SolanaCluster {
    return createSolanaCluster(props, {
        http: mainnet(typeof props === 'string' ? props : props.http),
        id: 'solana:mainnet',
        label: 'Mainnet',
    });
}

export function createSolanaTestnet(props: CreateSolanaProps = 'https://api.testnet.solana.com'): SolanaCluster {
    return createSolanaCluster(props, {
        http: testnet(typeof props === 'string' ? props : props.http),
        id: 'solana:testnet',
        label: 'Testnet',
    });
}
