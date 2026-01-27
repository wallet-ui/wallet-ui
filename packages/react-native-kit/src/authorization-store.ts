import { atom, computed } from 'nanostores';

import { Cache } from './cache';
import { WalletAuthorization } from './use-authorization';

export type AuthorizationStoreContext = {
    cache: Cache<WalletAuthorization | undefined>;
};

export function createAuthorizationStore(context: AuthorizationStoreContext) {
    const { cache } = context;

    const $authorization = atom<WalletAuthorization | null>(null);

    const $accounts = computed($authorization, auth => auth?.accounts ?? null);
    const $authToken = computed($authorization, auth => auth?.authToken);
    const $selectedAccount = computed($authorization, auth => auth?.selectedAccount);

    async function fetch(): Promise<WalletAuthorization | null> {
        const result = await cache.get();
        const auth = result ?? null;
        $authorization.set(auth);
        return auth;
    }

    async function persist(auth: WalletAuthorization | null): Promise<void> {
        if (auth) {
            await cache.set(auth);
        } else {
            await cache.clear();
        }
        $authorization.set(auth);
    }

    return {
        $accounts,
        $authToken,
        $selectedAccount,
        fetch,
        persist,
    };
}

export type AuthorizationStore = ReturnType<typeof createAuthorizationStore>;
