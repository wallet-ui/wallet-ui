import { lazy } from 'react';

export const ChainsFeature = lazy(() => import('./chains/chain-feature.tsx'));
export const RpcFeature = lazy(() => import('./rpc/rpc'));
export const WalletsFeature = lazy(() => import('./wallets/wallets'));
export const HomeFeature = lazy(() => import('./home/home'));
export const DevFeature = lazy(() => import('./dev/dev'));
