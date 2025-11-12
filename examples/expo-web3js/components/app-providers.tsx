import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { NetworkProvider } from '@/features/network/network-provider';
import { SolanaProvider } from '@/features/solana/solana-provider';

const queryClient = new QueryClient();
export function AppProviders({ children }: PropsWithChildren) {
    return (
        <QueryClientProvider client={queryClient}>
            <NetworkProvider>
                <SolanaProvider>{children}</SolanaProvider>
            </NetworkProvider>
        </QueryClientProvider>
    );
}
