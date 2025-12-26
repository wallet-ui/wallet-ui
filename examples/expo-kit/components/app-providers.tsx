import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { NetworkProvider } from '@/features/network/network-provider';
import { MobileWalletProvider } from '@/src';
import { AppConfig } from '@/constants/app-config';

const queryClient = new QueryClient();
export function AppProviders({ children }: PropsWithChildren) {
    return (
        <QueryClientProvider client={queryClient}>
            <NetworkProvider
                networks={AppConfig.networks}
                render={({ chain, endpoint }) => (
                    <MobileWalletProvider chain={chain} endpoint={endpoint} identity={AppConfig.identity}>
                        {children}
                    </MobileWalletProvider>
                )}
            />
        </QueryClientProvider>
    );
}
