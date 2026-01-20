import type {
    DevnetUrl as SolanaDevnetUrl,
    MainnetUrl as SolanaMainnetUrl,
    TestnetUrl as SolanaTestnetUrl,
} from '@solana/kit';

import { SolanaClusterId } from './solana-cluster-id';

export type { SolanaDevnetUrl, SolanaMainnetUrl, SolanaTestnetUrl };

export type SolanaLocalnetUrl = string & { '~cluster': 'localnet' };

export function localnet(url: string) {
    return url as SolanaLocalnetUrl;
}

export interface SolanaCluster {
    id: SolanaClusterId;
    label: string;
    url: SolanaDevnetUrl | SolanaLocalnetUrl | SolanaMainnetUrl | SolanaTestnetUrl | string;
    urlWs?: string;
}
