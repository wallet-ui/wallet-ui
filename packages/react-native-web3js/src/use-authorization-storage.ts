import { useQueryClient } from '@tanstack/react-query';

import { Account, WalletAuthorization } from './use-authorization';
import { useFetchAuthorization } from './use-fetch-authorization';
import { usePersistAuthorization } from './use-persist-authorization';

export function useAuthorizationStorage() {
    const queryKey = ['wallet-authorization'];
    const storageKey = 'authorization-cache';
    const queryClient = useQueryClient();
    const fetchQuery = useFetchAuthorization({ queryKey, storageKey });
    const persistMutation = usePersistAuthorization({ queryKey, storageKey });

    async function persist(next: WalletAuthorization | null, invalidate = false) {
        await persistMutation.mutateAsync(next);
        if (invalidate) {
            await queryClient.invalidateQueries({ queryKey });
        }
    }

    const accounts = fetchQuery.data?.accounts ?? null;
    const authToken: string | undefined = fetchQuery.data?.authToken ?? undefined;
    const isLoading = fetchQuery.isLoading;
    const selectedAccount: Account | undefined = fetchQuery.data?.selectedAccount ?? undefined;

    return {
        accounts,
        authToken,
        isLoading,
        persist,
        selectedAccount,
    } as const;
}
