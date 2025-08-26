import { SolanaClient, SolanaClientUrlOrMoniker } from 'gill';
import { createContext, ReactNode } from 'react';

export interface WalletUiGillContextProviderProps {
    children: ReactNode;
    urlOrMoniker: SolanaClientUrlOrMoniker;
}

export const WalletUiGillContext = createContext<SolanaClient>({} as SolanaClient);
