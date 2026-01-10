import type {
    DevnetUrl as SolanaDevnetUrl,
    MainnetUrl as SolanaMainnetUrl,
    TestnetUrl as SolanaTestnetUrl,
} from '@solana/kit';

import { SolanaClusterId } from './solana-cluster-id';

export type { SolanaDevnetUrl, SolanaMainnetUrl, SolanaTestnetUrl };

export type SolanaLocalnetUrl = string & { '~cluster': 'localnet' };

export interface SolanaCluster {
    http: SolanaDevnetUrl | SolanaLocalnetUrl | SolanaMainnetUrl | SolanaTestnetUrl | string;
    id: SolanaClusterId;
    label: string;
    /** @deprecated use `http` instead */
    url?: SolanaDevnetUrl | SolanaLocalnetUrl | SolanaMainnetUrl | SolanaTestnetUrl | string;
    ws?: string;
}
