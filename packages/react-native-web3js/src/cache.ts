/**
 * @example
 * This example demonstrates how to create an in-memory cache using the `createMemoryCache` function. This function returns an object that conforms to the `Cache` interface, providing methods to `clear`, `get`, and `set` data. The cache stores a single value of type `T` and logs its operations to the console.
 * ```ts
 * export function createMemoryCache<T>(data: T | undefined = undefined): Cache<T> {
 *     return {
 *         async clear(): Promise<void> {
 *             console.log(`Clear data:`, { data });
 *             data = undefined;
 *         },
 *         async get(): Promise<T | undefined> {
 *             console.log('Get data:', { data });
 *             return data;
 *         },
 *         async set(value: T): Promise<void> {
 *             console.log('Set data:', { data, value });
 *             data = value;
 *         },
 *     };
 * }
 * const cache = createMemoryCache<WalletAuthorization>();
 * ```
 */
export interface Cache<T> {
    clear(): Promise<void>;
    get(): Promise<T | undefined>;
    set(value: T): Promise<void>;
}
