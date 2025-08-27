import { SolanaClusterId } from '@wallet-ui/core';
import type { SolanaClusterMoniker } from 'gill';

export function getSolanaClusterMoniker(clusterId: SolanaClusterId): SolanaClusterMoniker {
    if (!clusterId.startsWith('solana:')) {
        throw new Error(`Invalid cluster id: ${clusterId}`);
    }
    return clusterId.replace('solana:', '') as SolanaClusterMoniker;
}
