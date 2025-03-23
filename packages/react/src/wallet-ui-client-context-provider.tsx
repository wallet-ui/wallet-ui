import { createSolanaClient, SolanaClient } from 'gill';
import React, { useMemo } from 'react';

import {
    WalletUiSolanaClientContext,
    WalletUiSolanaClientContextProviderProps,
} from './wallet-ui-solana-client-context';

export function WalletUiClientContextProvider({ children, urlOrMoniker }: WalletUiSolanaClientContextProviderProps) {
    return (
        <WalletUiSolanaClientContext.Provider
            value={useMemo(() => createSolanaClient({ urlOrMoniker }) as SolanaClient, [urlOrMoniker])}
        >
            {children}
        </WalletUiSolanaClientContext.Provider>
    );
}
