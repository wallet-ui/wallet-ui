import type { ClusterUrl } from '@solana/kit';
import { useWalletUiCluster } from '@wallet-ui/react';
import React, { useMemo } from 'react';

import { createSolanaClient } from './create-solana-client';
import { WalletUiKitContext, WalletUiKitContextProviderProps } from './wallet-ui-kit-context';

export function WalletUiKitProvider<T extends ClusterUrl>({ children, options }: WalletUiKitContextProviderProps<T>) {
    const { cluster } = useWalletUiCluster();

    return (
        <WalletUiKitContext.Provider value={useMemo(() => createSolanaClient<T>(options), [options])}>
            {children}
        </WalletUiKitContext.Provider>
    );
}
