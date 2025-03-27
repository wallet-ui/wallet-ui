import { createStorage } from './create-storage';
import { Storage } from './storage';
import { SolanaClusterId } from './types/solana-cluster-id';

export type StorageCluster = Storage<SolanaClusterId>;

export function createStorageCluster({
    initial,
    key,
}: {
    initial?: SolanaClusterId;
    key?: string;
} = {}): StorageCluster {
    return createStorage<SolanaClusterId>({
        initial: initial ?? 'solana:devnet',
        key: key ?? 'wallet-ui:cluster',
    });
}
