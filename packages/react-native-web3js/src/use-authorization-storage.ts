import { useQueryClient } from '@tanstack/react-query';

import { Account, WalletAuthorization, WalletAuthorizationCache } from './use-authorization';
import { useFetchAuthorization } from './use-fetch-authorization';
import { usePersistAuthorization } from './use-persist-authorization';

export function useAuthorizationStorage({ cache }: { cache: WalletAuthorizationCache }) {
    const queryKey = ['wallet-authorization'];
    const queryClient = useQueryClient();
    const fetchQuery = useFetchAuthorization({ cache, queryKey });
    const persistMutation = usePersistAuthorization({ cache, queryKey });

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
