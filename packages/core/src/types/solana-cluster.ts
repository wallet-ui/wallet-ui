import type { DevnetUrl, LocalnetUrl, MainnetUrl, SolanaClusterMoniker, TestnetUrl } from 'gill';

import { SolanaClusterId } from './solana-cluster-id';

export interface SolanaCluster {
    cluster: SolanaClusterMoniker;
    id: SolanaClusterId;
    label: string;
    urlOrMoniker: DevnetUrl | LocalnetUrl | MainnetUrl | TestnetUrl | string;
}
