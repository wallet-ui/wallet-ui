import { createStorage } from './create-storage';
import { Storage } from './storage';

export type StorageAccount = Storage<string | undefined>;

export function createStorageAccount({
    initial,
    key,
}: {
    initial?: string | undefined;
    key?: string;
} = {}): StorageAccount {
    return createStorage<string | undefined>({
        initial,
        key: key ?? 'wallet-ui:account',
    });
}
