import { useStore } from '@nanostores/react';
import { useMemo } from 'react';

import { AuthorizationStore } from './authorization-store';

export function useAuthorizationStore({ store }: { store: AuthorizationStore }) {
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
