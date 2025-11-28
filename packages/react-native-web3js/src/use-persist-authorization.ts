import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';

import { WalletAuthorization } from './use-authorization';
import { useQueryConfig } from './use-query-config';

export function usePersistAuthorization() {
    const { queryClient, queryKey, storageKey } = useQueryConfig();
    return useMutation({
        mutationFn: async (auth: WalletAuthorization | null): Promise<void> => {
            await AsyncStorage.setItem(storageKey, JSON.stringify(auth));
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey });
        },
    });
}
