import { useStore } from '@nanostores/react';
import { useMemo, useRef } from 'react';

import { AuthorizationStore, createAuthorizationStore } from './authorization-store';
import { WalletAuthorizationCache } from './use-authorization';

export function useAuthorizationStore({ cache }: { cache: WalletAuthorizationCache }) {
    const storeRef = useRef<AuthorizationStore | null>(null);

    if (!storeRef.current) {
        storeRef.current = createAuthorizationStore({ cache });
        storeRef.current.fetch().catch(console.error);
    }

    const store = storeRef.current;

    const accounts = useStore(store.$accounts);
    const authToken = useStore(store.$authToken);
    const selectedAccount = useStore(store.$selectedAccount);

    return useMemo(
        () => ({
            accounts,
            authToken,
            persist: store.persist,
            selectedAccount,
        }),
        [accounts, authToken, store.persist, selectedAccount],
    );
}
