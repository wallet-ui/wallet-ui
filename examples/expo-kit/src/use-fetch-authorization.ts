import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';

import { WalletAuthorization } from './use-authorization';
import { useQueryConfig } from './use-query-config';
import { address } from '@solana/kit';

function cacheReviver(key: string, value: unknown) {
    if (key === 'publicKey' && typeof value === 'string') {
        return address(value); // the PublicKeyInitData should match the actual data structure stored in AsyncStorage
    } else {
        return value;
    }
}

export function useFetchAuthorization() {
    const { queryKey, storageKey } = useQueryConfig();
    return useQuery({
        queryFn: async (): Promise<WalletAuthorization | null> => {
            const cacheFetchResult = await AsyncStorage.getItem(storageKey);

            // Return prior authorization, if found.
            return cacheFetchResult ? JSON.parse(cacheFetchResult, cacheReviver) : null;
        },
        queryKey,
    });
}
