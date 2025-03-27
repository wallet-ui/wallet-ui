'use client';
import '@wallet-ui/tailwind/index.css';
import {
    createSolanaDevnet,
    createSolanaLocalnet,
    createSolanaTestnet,
    createStorageCluster,
    createWalletUiConfig,
    WalletUi,
} from '@wallet-ui/react';
import { ThemeProvider } from 'next-themes';
import React from 'react';
import { ReactQueryProvider } from './react-query-provider';

// TODO: Figure out how we can store the cluster in the cookie
export const storageCluster = createStorageCluster();
export const walletUiConfig = createWalletUiConfig({
    clusters: [createSolanaDevnet(), createSolanaLocalnet(), createSolanaTestnet()],
    clusterStorage: storageCluster,
});

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <WalletUi config={walletUiConfig}>
                <ReactQueryProvider>{children}</ReactQueryProvider>
            </WalletUi>
        </ThemeProvider>
    );
}
