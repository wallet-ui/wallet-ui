import type { ClusterUrl } from '@solana/kit';
import { createContext, ReactNode } from 'react';

import { CreateSolanaClientOptions } from './create-solana-client';
import { SolanaClient } from './solana-client';

export interface WalletUiKitContextProviderProps<T extends ClusterUrl> {
    children: ReactNode;
    options: CreateSolanaClientOptions<T>;
}

export const WalletUiKitContext = createContext<SolanaClient>({} as SolanaClient);
