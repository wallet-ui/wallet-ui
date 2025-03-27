import { Storage } from './storage';

export function createStorage<T>({ initial, key }: { initial: T; key: string }) {
    return new Storage(key, initial);
}
