import { SolanaCluster } from '@wallet-ui/core';
import React from 'react';

import { useWalletUiCluster } from './use-wallet-ui-cluster';
import { WalletUiAccountContextProvider } from './wallet-ui-account-context-provider';
import { WalletUiClientContextProviderProps } from './wallet-ui-client-context';
import { WalletUiClientContextProvider } from './wallet-ui-client-context-provider';
import { WalletUiClusterContextProvider } from './wallet-ui-cluster-context-provider';
import { WalletUiContextProviderProps } from './wallet-ui-context';
import { WalletUiContextProvider } from './wallet-ui-context-provider';

export interface WalletUiConfig extends Omit<WalletUiContextProviderProps, 'children'> {
    clusterStorageKey?: string;
    clusters: SolanaCluster[];
    selectedAccountStorageKey?: string;
}

export interface WalletUiProps {
    children: React.ReactNode;
    config: WalletUiConfig;
}

export function WalletUi({
    children,
    config: { clusters, clusterStorageKey, selectedAccountStorageKey, ...config },
}: WalletUiProps) {
    return (
        <React.Fragment>
            <WalletUiClusterContextProvider clusters={clusters} storageKey={clusterStorageKey}>
                <WalletUiClientLoader>
                    <WalletUiAccountContextProvider storageKey={selectedAccountStorageKey}>
                        <WalletUiContextProvider {...config}>{children}</WalletUiContextProvider>
                    </WalletUiAccountContextProvider>
                </WalletUiClientLoader>
            </WalletUiClusterContextProvider>
        </React.Fragment>
    );
}

function WalletUiClientLoader({ children }: Omit<WalletUiClientContextProviderProps, 'urlOrMoniker'>) {
    const { cluster } = useWalletUiCluster();
    return (
        <WalletUiClientContextProvider urlOrMoniker={cluster.urlOrMoniker}>{children}</WalletUiClientContextProvider>
    );
}
