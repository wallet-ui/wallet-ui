import { SolanaClient, SolanaClientUrlOrMoniker } from 'gill';
import { createContext, ReactNode } from 'react';

export interface WalletUiSolanaClientContextProviderProps {
    children: ReactNode;
    urlOrMoniker: SolanaClientUrlOrMoniker;
}

export const WalletUiSolanaClientContext = createContext<SolanaClient>({} as SolanaClient);
