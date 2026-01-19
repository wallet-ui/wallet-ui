import { useMutation, useQueryClient } from '@tanstack/react-query';

import { WalletAuthorization, WalletAuthorizationCache } from './use-authorization';

export function usePersistAuthorization({ cache, queryKey }: { cache: WalletAuthorizationCache; queryKey: string[] }) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (auth: WalletAuthorization | null): Promise<void> => {
            if (auth) {
                await cache.set(auth);
            } else {
                await cache.clear();
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey });
        },
    });
}
