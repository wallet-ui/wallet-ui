import { SolanaClient } from '@wallet-ui/core';
import { createContext } from 'react';

export const WalletUiClientContext = createContext<SolanaClient>({} as SolanaClient);
