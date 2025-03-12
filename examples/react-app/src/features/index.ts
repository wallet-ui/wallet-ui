import { lazy } from 'react';

export const ClustersFeature = lazy(() => import('./clusters/cluster-feature'));
export const RpcFeature = lazy(() => import('./rpc/rpc'));
export const WalletsFeature = lazy(() => import('./wallets/wallets'));
export const HomeFeature = lazy(() => import('./home/home'));
export const DevFeature = lazy(() => import('./dev/dev'));
export const UiFeature = lazy(() => import('./ui/ui'));
