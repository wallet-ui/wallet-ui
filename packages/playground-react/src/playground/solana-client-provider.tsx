import React, { ReactNode } from 'react';
import { rpc } from '@solana/kit-plugin-rpc';
import { SolanaCluster, useWalletUi } from '@wallet-ui/react';
import { createEmptyClient } from '@solana/kit';

const SolanaClientContext = React.createContext<SolanaClient>({} as SolanaClient);

export function SolanaClientProvider({ children }: { children: ReactNode }) {
    const { cluster } = useWalletUi();
    return <SolanaClientContext.Provider value={createSolanaClient(cluster)}>{children}</SolanaClientContext.Provider>;
}

export const useSolanaClient = () => React.useContext(SolanaClientContext);

export type SolanaClient = ReturnType<typeof createSolanaClient>;
function createSolanaClient(cluster: SolanaCluster) {
    return createEmptyClient().use(rpc(cluster.url, cluster.urlWs ? { url: cluster.urlWs } : undefined));
}