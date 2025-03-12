import { Suspense } from 'react';
import { Navigate, RouteObject, useRoutes } from 'react-router-dom';

import { HeaderLink } from '../components/header.tsx';
import { ClustersFeature, DevFeature, HomeFeature, RpcFeature, UiFeature, WalletsFeature } from '../features';
import { AppLayout } from './app-layout.tsx';

const routes: RouteObject[] = [
    { element: <Navigate replace to="/home" />, path: '/' },
    { element: <ClustersFeature />, path: '/clusters' },
    { element: <DevFeature />, path: '/dev' },
    { element: <HomeFeature />, path: '/home' },
    { element: <RpcFeature />, path: '/rpc' },
    { element: <UiFeature />, path: '/ui' },
    { element: <WalletsFeature />, path: '/wallets' },
];
const links: HeaderLink[] = [
    { label: 'Home', to: '/home' },
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
