import { createAuthorizationStore } from '../authorization-store';
import { createCache, createExpectedAuthorization } from '../test-utils/fixtures';

describe('authorization-store', () => {
    it('loads authorization from the cache and exposes computed values', async () => {
        expect.assertions(4);
        const authorization = createExpectedAuthorization();
        const cache = createCache({
            get: jest.fn().mockResolvedValue(authorization),
        });
        const store = createAuthorizationStore({ cache });

        await expect(store.fetch()).resolves.toBe(authorization);
        expect(store.$accounts.get()).toBe(authorization.accounts);
        expect(store.$authToken.get()).toBe(authorization.authToken);
        expect(store.$selectedAccount.get()).toBe(authorization.selectedAccount);
    });

    it('persists authorization to the cache and exposes computed values', async () => {
        expect.assertions(5);
        const authorization = createExpectedAuthorization();
        const cache = createCache();
        const store = createAuthorizationStore({ cache });

        await store.persist(authorization);

        expect(cache.set).toHaveBeenCalledWith(authorization);
        expect(cache.clear).not.toHaveBeenCalled();
        expect(store.$accounts.get()).toBe(authorization.accounts);
        expect(store.$authToken.get()).toBe(authorization.authToken);
        expect(store.$selectedAccount.get()).toBe(authorization.selectedAccount);
    });

    it('clears authorization from the cache and resets computed values', async () => {
        expect.assertions(4);
        const authorization = createExpectedAuthorization();
        const cache = createCache();
        const store = createAuthorizationStore({ cache });

        await store.persist(authorization);
        await store.persist(null);

        expect(cache.clear).toHaveBeenCalledTimes(1);
        expect(store.$accounts.get()).toBeNull();
        expect(store.$authToken.get()).toBeUndefined();
        expect(store.$selectedAccount.get()).toBeUndefined();
    });
});
