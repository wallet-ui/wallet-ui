import { SolanaWalletUiButton } from '@wallet-ui/react';
import { TestReactPanel } from '@wallet-ui/test-react';
import { Suspense } from 'react';
import { useRoutes } from 'react-router';
import { AppLayout } from './app-layout.tsx';
import { AppProviders } from './app-providers.tsx';

export function App() {
    const router = useRoutes([
        {
            index: true,
            element: (
                <div>
                    <TestReactPanel />
                    <hr style={{ margin: '1rem 0' }} />
                    <SolanaWalletUiButton />
                </div>
            ),
        },
        { path: '/about', element: <div>About</div> },
    ]);
    const links = [
        { label: 'Home', to: '/' },
        { label: 'About', to: '/about' },
    ];
    return (
        <AppProviders>
            <AppLayout links={links}>
                <Suspense fallback={<div>Loading...</div>}>{router}</Suspense>
            </AppLayout>
        </AppProviders>
    );
}
