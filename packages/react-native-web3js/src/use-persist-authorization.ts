import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { WalletAuthorization } from './use-authorization';

export function usePersistAuthorization({ queryKey, storageKey }: { queryKey: string[]; storageKey: string }) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (auth: WalletAuthorization | null): Promise<void> => {
            await AsyncStorage.setItem(storageKey, JSON.stringify(auth));
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey });
        },
    });
}
