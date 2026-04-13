import { act, renderHook } from '../test-utils/react-test-renderer';
import { createAuthorizationStore } from '../authorization-store';
import { createCache, createExpectedAuthorization } from '../test-utils/fixtures';
import { useAuthorizationStore } from '../use-authorization-store';

describe('useAuthorizationStore', () => {
    it('returns the empty authorization state before any authorization is loaded', () => {
        expect.assertions(4);
        const store = createAuthorizationStore({ cache: createCache() });
        const hook = renderHook(useAuthorizationStore, {
            initialProps: { store },
        });

        expect(hook.result.accounts).toBeNull();
        expect(hook.result.authToken).toBeUndefined();
        expect(hook.result.persist).toBe(store.persist);
        expect(hook.result.selectedAccount).toBeUndefined();
    });

    it('updates when the authorization store changes', async () => {
        expect.assertions(4);
        const authorization = createExpectedAuthorization();
        const store = createAuthorizationStore({ cache: createCache() });
        const hook = renderHook(useAuthorizationStore, {
            initialProps: { store },
        });

        await act(async () => {
            await store.persist(authorization);
        });

        expect(hook.result.accounts).toBe(authorization.accounts);
        expect(hook.result.authToken).toBe(authorization.authToken);
        expect(hook.result.persist).toBe(store.persist);
        expect(hook.result.selectedAccount).toBe(authorization.selectedAccount);
    });
});
