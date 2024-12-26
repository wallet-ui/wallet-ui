import React from 'react';

import { SolanaClientContext } from './solana-client-context';

export function useSolanaClient() {
    return React.useContext(SolanaClientContext);
}
