import { PlaygroundWalletUiClusterDropdown, TestReactPanel } from '@wallet-ui/test-react';
import { Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router';
import { AppLayout } from './app-layout.tsx';
import { AppProviders } from './app-providers.tsx';

export function App() {
    const router = useRoutes([
        { index: true, element: <Navigate to="/playground" replace /> },
        {
            path: '/playground',
            element: (
                <div>
                    <TestReactPanel />
                </div>
            ),
        },
        {
            path: '/clusters',
            element: <PlaygroundWalletUiClusterDropdown />,
        },
    ]);
    const links = [
        { label: 'Playground', to: '/playground' },
        { label: 'Clusters', to: '/clusters' },
    ];
    return (
        <AppProviders>
            <AppLayout links={links}>
                <Suspense fallback={<div>Loading...</div>}>{router}</Suspense>
            </AppLayout>
        </AppProviders>
    );
}
