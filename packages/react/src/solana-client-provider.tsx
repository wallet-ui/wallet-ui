import React, { ReactNode } from 'react';

import { createSolanaClient, SolanaClientConfig } from './solana-client';
import { SolanaClientContext } from './solana-client-context';

export function SolanaClientProvider({ children, ...props }: SolanaClientConfig & { children: ReactNode }) {
    const client = createSolanaClient(props);

    return <SolanaClientContext.Provider value={client}>{children}</SolanaClientContext.Provider>;
}
