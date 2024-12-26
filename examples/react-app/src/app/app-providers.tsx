import { SolanaClientProvider } from '@wallet-ui/react';
import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <BrowserRouter>
            <SolanaClientProvider rpc="https://api.devnet.solana.com">{children}</SolanaClientProvider>
        </BrowserRouter>
    );
}
