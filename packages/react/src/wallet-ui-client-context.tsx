import { SolanaClient } from '@wallet-ui/core';
import { SolanaClientUrlOrMoniker } from 'gill';
import { createContext, ReactNode } from 'react';

export interface WalletUiClientContextProviderProps {
    children: ReactNode;
    urlOrMoniker: SolanaClientUrlOrMoniker;
}

export type WalletUiClientContextValue = SolanaClient;

export const WalletUiClientContext = createContext<WalletUiClientContextValue>({} as WalletUiClientContextValue);
