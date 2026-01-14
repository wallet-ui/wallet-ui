import type { PartializedState } from './createConfig.js';
import { deserialize as deserialize_ } from './deserialize.js';
import { serialize as serialize_ } from './serialize.js';



export type Compute<type> = unknown & { [key in keyof type]: type[key] };

// key-values for loose autocomplete and typing
export type StorageItemMap<T extends object = object> = {
    recentConnectorId: string;
    state: T;
};

export type Storage<
    itemMap extends Record<string, unknown> = Record<string, unknown>,
    ///
    storageItemMap extends StorageItemMap = itemMap & StorageItemMap,
> = {
    getItem<
        key extends keyof storageItemMap,
        value extends storageItemMap[key],
        defaultValue extends value | null | undefined,
    >(
        key: key,
        defaultValue?: defaultValue,
    ): Promise<defaultValue extends null ? value | null : value> | (defaultValue extends null ? value | null : value);
    key: string;
    removeItem(key: keyof storageItemMap): Promise<void> | void;
    setItem<key extends keyof storageItemMap, value extends storageItemMap[key] | null>(
        key: key,
        value: value,
    ): Promise<void> | void;
};

export type BaseStorage = {
    getItem(key: string): Promise<string | null | undefined> | string | null | undefined;
    removeItem(key: string): Promise<void> | void;
    setItem(key: string, value: string): Promise<void> | void;
};

export type CreateStorageParameters = {
    deserialize?: (<type>(value: string) => type | unknown) | undefined;
    key?: string | undefined;
    serialize?: (<type>(value: type | any) => string) | undefined;
    storage?: Compute<BaseStorage> | undefined;
};

export function createStorage<
    itemMap extends Record<string, unknown> = Record<string, unknown>,
    storageItemMap extends StorageItemMap = itemMap & StorageItemMap,
>(parameters: CreateStorageParameters): Compute<Storage<storageItemMap>> {
    const {
        deserialize = deserialize_,
        key: prefix = 'wagmi',
        serialize = serialize_,
        storage = noopStorage,
    } = parameters;

    function unwrap<type>(value: type): Promise<type> | type {
        if (value instanceof Promise) return value.then(x => x).catch(() => null);
        return value;
    }

    return {
        ...storage,
        async getItem(key: string, defaultValue) {
            const value = storage.getItem(`${prefix}.${key}`);
            const unwrapped = await unwrap(value);
            if (unwrapped) return deserialize(unwrapped) ?? null;
            return defaultValue ?? null;
        },
        key: prefix,
        async removeItem(key: string) {
            await unwrap(storage.removeItem(`${prefix}.${key}`));
        },
        async setItem(key: string, value) {
            const storageKey = `${prefix}.${key}`;
            if (value === null) await unwrap(storage.removeItem(storageKey));
            else await unwrap(storage.setItem(storageKey, serialize(value)));
        },
    };
}

export const noopStorage = {
    getItem: () => null,
    removeItem: () => {},
    setItem: () => {},
} satisfies BaseStorage;

export function getDefaultStorage() {
    const storage = (() => {
        // biome-ignore lint/complexity/useOptionalChain: _
        if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
        return noopStorage;
    })();
    return {
        getItem(key) {
            return storage.getItem(key);
        },
        removeItem(key) {
            storage.removeItem(key);
        },
        setItem(key, value) {
            try {
                storage.setItem(key, value);
                // silence errors by default (QuotaExceededError, SecurityError, etc.)
            } catch {}
        },
    } satisfies BaseStorage;
}
