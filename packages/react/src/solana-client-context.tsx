import React from 'react';

import { SolanaClient } from './solana-client';

export const SolanaClientContext = React.createContext<SolanaClient>({} as SolanaClient);
