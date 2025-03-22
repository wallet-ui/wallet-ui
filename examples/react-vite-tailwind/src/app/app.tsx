import { PlaygroundAccount, PlaygroundClient, PlaygroundCluster, PlaygroundUi } from '@wallet-ui/test-react';

import { PlaygroundWallet } from '@wallet-ui/test-react/playground-wallet.tsx';
import { Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router';
import { AppLayout } from './app-layout.tsx';
import { AppProviders } from './app-providers.tsx';

export function App() {
    const router = useRoutes([
        { index: true, element: <Navigate to="/account" replace /> },
        {
            path: '/account',
            element: <PlaygroundAccount />,
        },
        {
            path: '/cluster',
            element: <PlaygroundCluster />,
        },
        {
            path: '/client',
            element: <PlaygroundClient />,
        },
        {
            path: '/ui',
            element: <PlaygroundUi />,
        },
        {
            path: '/wallets',
            element: <PlaygroundWallet />,
        },
    ]);
    const links = [
        { label: 'Account', to: '/account' },
        { label: 'Cluster', to: '/cluster' },
        { label: 'Client', to: '/client' },
        { label: 'UI', to: '/ui' },
        { label: 'Wallets', to: '/wallets' },
    ];
    return (
        <AppProviders>
            <AppLayout links={links}>
                <Suspense fallback={<div>Loading...</div>}>{router}</Suspense>
            </AppLayout>
        </AppProviders>
    );
}
