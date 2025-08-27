import { useWalletUiCluster } from '@wallet-ui/react';
import { createSolanaClient } from 'gill';
import React, { ReactNode, useMemo } from 'react';

import { WalletUiGillContext } from './wallet-ui-gill-context';

export function WalletUiGillProvider({ children, url }: { children: ReactNode; url?: string }) {
    const { cluster } = useWalletUiCluster();
    const urlOrMoniker = useMemo(() => url ?? cluster.url, [cluster.url, url]);
    return (
        <WalletUiGillContext.Provider value={useMemo(() => createSolanaClient({ urlOrMoniker }), [urlOrMoniker])}>
            {children}
        </WalletUiGillContext.Provider>
    );
}
