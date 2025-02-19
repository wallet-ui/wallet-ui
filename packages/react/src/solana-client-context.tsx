import { SolanaClient } from '@wallet-ui/core';
import { createContext, useContext } from 'react';

export const SolanaClientContext = createContext<SolanaClient>({} as SolanaClient);

export function useSolanaClient() {
    return useContext(SolanaClientContext);
}
