import { chainDevnet, chainLocal, chainTestnet, SolanaChain } from '@wallet-ui/core';
import { SolanaProvider } from '@wallet-ui/react';
import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

const chains: SolanaChain[] = [
    chainDevnet(),
    // Customize the chains here
    chainLocal({ rpcUrl: 'http://localhost:8899' }),
    chainTestnet(),
    // Enable mainnet when it's ready.
    // You will need a custom RPC URL for mainnet as the public RPC url can't be used for production.
    // chainMainnet(),
];

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <BrowserRouter>
            <SolanaProvider chains={chains}>{children}</SolanaProvider>
        </BrowserRouter>
    );
}
