import type { DevnetUrl, MainnetUrl, TestnetUrl } from '@solana/kit';

import { SolanaClusterId } from './solana-cluster-id';

export type { DevnetUrl, MainnetUrl, TestnetUrl } from '@solana/kit';

export type LocalnetUrl = string & { '~cluster': 'localnet' };

export interface SolanaCluster {
    cluster: 'devnet' | 'localnet' | 'mainnet' | 'testnet';
    id: SolanaClusterId;
    label: string;
    urlOrMoniker: DevnetUrl | LocalnetUrl | MainnetUrl | TestnetUrl | string;
}
