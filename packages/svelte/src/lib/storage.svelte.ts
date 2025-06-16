import { PersistedState } from 'runed';

export function createStorage<T>({ initial, key }: { initial: T; key: string }) {
    return new PersistedState(key, initial);
}

export type StorageAccount = PersistedState<string | undefined>;

export function createStorageAccount({
    initial,
    key,
}: {
    initial?: string | undefined;
    key?: string;
} = {}): StorageAccount {
    return new PersistedState(key ?? 'wallet-ui:account', initial);
}

export type StorageCluster = PersistedState<string | undefined>;

export function createStorageCluster({
    initial,
    key,
}: {
    initial?: string | undefined;
    key?: string;
} = {}): StorageCluster {
    return new PersistedState(key ?? 'wallet-ui:cluster', initial);
}