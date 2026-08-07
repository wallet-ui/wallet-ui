import { createClient } from '@solana/kit';
import { solanaRpcConnection } from '@solana/kit-plugin-rpc';
import { SolanaCluster, useWalletUi } from '@wallet-ui/react';
import React, { ReactNode } from 'react';

const SolanaClientContext = React.createContext<SolanaClient>({} as SolanaClient);

export function SolanaClientProvider({ children }: { children: ReactNode }) {
    const { cluster } = useWalletUi();
    return <SolanaClientContext.Provider value={createSolanaClient(cluster)}>{children}</SolanaClientContext.Provider>;
}

export const useSolanaClient = () => React.useContext(SolanaClientContext);

export type SolanaClient = ReturnType<typeof createSolanaClient>;
function createSolanaClient(cluster: SolanaCluster) {
    return createClient().use(
        solanaRpcConnection({
            rpcSubscriptionsUrl: cluster.urlWs,
            rpcUrl: cluster.url,
        }),
    );
}
