import { SolanaClientUrlOrMoniker } from '@wallet-ui/core';
import { createSolanaClient } from 'gill';
import React, { ReactNode, useMemo } from 'react';

import { WalletUiClientContext } from './wallet-ui-client-context';

export function WalletUiClientProvider({
    children,
    urlOrMoniker,
}: {
    children: ReactNode;
    urlOrMoniker: SolanaClientUrlOrMoniker;
}) {
    const value = useMemo(() => createSolanaClient({ urlOrMoniker }), [urlOrMoniker]);

    return <WalletUiClientContext.Provider value={value}>{children}</WalletUiClientContext.Provider>;
}
