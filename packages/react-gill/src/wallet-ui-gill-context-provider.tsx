import { createSolanaClient, SolanaClient } from 'gill';
import React, { useMemo } from 'react';

import { WalletUiGillContext, WalletUiGillContextProviderProps } from './wallet-ui-gill-context';

export function WalletUiGillContextProvider({ children, urlOrMoniker }: WalletUiGillContextProviderProps) {
    return (
        <WalletUiGillContext.Provider
            value={useMemo(() => createSolanaClient({ urlOrMoniker }) as SolanaClient, [urlOrMoniker])}
        >
            {children}
        </WalletUiGillContext.Provider>
    );
}
