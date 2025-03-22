import { createSolanaClient } from 'gill';
import React, { useMemo } from 'react';

import { WalletUiClientContext, WalletUiClientContextProviderProps } from './wallet-ui-client-context';

export function WalletUiClientContextProvider({ children, urlOrMoniker }: WalletUiClientContextProviderProps) {
    const value = useMemo(() => createSolanaClient({ urlOrMoniker }), [urlOrMoniker]);

    return <WalletUiClientContext.Provider value={value}>{children}</WalletUiClientContext.Provider>;
}
