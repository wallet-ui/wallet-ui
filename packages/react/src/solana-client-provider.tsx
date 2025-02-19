import { SolanaClientUrlOrMoniker } from '@wallet-ui/core';
import { createSolanaClient } from 'gill';
import React, { ReactNode, useMemo } from 'react';

import { SolanaClientContext } from './solana-client-context';

export function SolanaClientProvider({
    children,
    urlOrMoniker,
}: {
    children: ReactNode;
    urlOrMoniker: SolanaClientUrlOrMoniker;
}) {
    const value = useMemo(() => createSolanaClient({ urlOrMoniker }), [urlOrMoniker]);

    return <SolanaClientContext.Provider value={value}>{children}</SolanaClientContext.Provider>;
}
