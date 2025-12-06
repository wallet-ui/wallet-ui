import AsyncStorage from '@react-native-async-storage/async-storage';
import { PublicKey, PublicKeyInitData } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';

import { WalletAuthorization } from './use-authorization';
import { useQueryConfig } from './use-query-config';

function cacheReviver(key: string, value: unknown) {
    if (key === 'publicKey') {
        return new PublicKey(value as PublicKeyInitData); // the PublicKeyInitData should match the actual data structure stored in AsyncStorage
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
