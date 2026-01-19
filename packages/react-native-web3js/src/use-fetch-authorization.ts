import { useQuery } from '@tanstack/react-query';

import { WalletAuthorization, WalletAuthorizationCache } from './use-authorization';

export function useFetchAuthorization({ cache, queryKey }: { cache: WalletAuthorizationCache; queryKey: string[] }) {
    return useQuery({
        queryFn: async (): Promise<WalletAuthorization | null> => {
            const result = await cache.get();
            return result ?? null;
        },
        queryKey,
    });
}
