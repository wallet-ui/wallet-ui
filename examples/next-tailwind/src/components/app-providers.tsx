'use client';
import '@wallet-ui/tailwind/index.css';
import { createSolanaDevnet, createSolanaLocalnet, createSolanaTestnet, createWalletUiConfig } from '@wallet-ui/react';
import { ThemeProvider } from 'next-themes';
import React from 'react';
import { ReactQueryProvider } from './react-query-provider';

const config = createWalletUiConfig({
    clusters: [createSolanaDevnet(), createSolanaLocalnet(), createSolanaTestnet()],
});

export function AppProviders({ children }: { children: React.ReactNode }) {
    console.log('WalletUiConfig', config);
    return (
        <ThemeProvider>
            {/*<WalletUi config={config}>*/}
            <ReactQueryProvider>{children}</ReactQueryProvider>
            {/*</WalletUi>*/}
        </ThemeProvider>
    );
}
