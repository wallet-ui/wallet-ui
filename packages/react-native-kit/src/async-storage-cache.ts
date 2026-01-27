import AsyncStorage from '@react-native-async-storage/async-storage';
import { address } from '@solana/kit';

import { Cache } from './cache';

function cacheReviver(key: string, value: unknown) {
    if (key === 'address' && typeof value === 'string') {
        return address(value);
    } else {
        return value;
    }
}

export class AsyncStorageCache<T> implements Cache<T> {
    constructor(private readonly storageKey: string) {}

    async clear(): Promise<void> {
        await AsyncStorage.removeItem(this.storageKey);
    }

    async get(): Promise<T | undefined> {
        const cacheFetchResult = await AsyncStorage.getItem(this.storageKey);
        if (!cacheFetchResult) {
            return undefined;
        }
        try {
            return JSON.parse(cacheFetchResult, cacheReviver) as T;
        } catch (error) {
            console.warn(`Failed to parse cached data for key ${this.storageKey}:`, error);
            return undefined;
        }
    }

    async set(value: T): Promise<void> {
        await AsyncStorage.setItem(this.storageKey, JSON.stringify(value));
    }
}

export function createAsyncStorageCache<T>(storageKey = 'authorization-cache') {
    return new AsyncStorageCache<T>(storageKey);
}
