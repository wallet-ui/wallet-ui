import { lazy } from 'react';

export const AccountFeature = lazy(() => import('./account/account-feature.tsx'));
export const ClustersFeature = lazy(() => import('./clusters/cluster-feature'));
export const RpcFeature = lazy(() => import('./rpc/rpc'));
export const WalletsFeature = lazy(() => import('./wallets/wallets'));
export const DevFeature = lazy(() => import('./dev/dev'));
export const UiFeature = lazy(() => import('./ui/ui'));
