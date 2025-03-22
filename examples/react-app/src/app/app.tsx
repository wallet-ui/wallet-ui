import { Suspense } from 'react';
import { Navigate, RouteObject, useRoutes } from 'react-router';

import { HeaderLink } from '../components/app-header.tsx';
import { AppLayout } from '../components/app-layout.tsx';
import { AccountFeature, ClustersFeature, DevFeature, RpcFeature, UiFeature, WalletsFeature } from '../features';

const routes: RouteObject[] = [
    { element: <Navigate replace to="/account" />, path: '/' },
    { element: <AccountFeature />, path: '/account' },
    { element: <ClustersFeature />, path: '/clusters' },
    { element: <DevFeature />, path: '/dev' },
    { element: <RpcFeature />, path: '/rpc' },
    { element: <UiFeature />, path: '/ui' },
    { element: <WalletsFeature />, path: '/wallets' },
];
const links: HeaderLink[] = [
    { label: 'Account', to: '/account' },
    { label: 'Wallets', to: '/wallets' },
    { label: 'RPC', to: '/rpc' },
    { label: 'Clusters', to: '/clusters' },
    { label: 'Dev', to: '/dev' },
    { label: 'UI', to: '/ui' },
];

export function App() {
    const router = useRoutes(routes);

    return (
        <AppLayout links={links}>
            <Suspense fallback={<div>Loading...</div>}>{router}</Suspense>
        </AppLayout>
    );
}
