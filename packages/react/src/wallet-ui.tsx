import { SolanaCluster, StorageAccount, StorageCluster } from '@wallet-ui/core';
import React from 'react';

import { WalletUiAccountContextProvider } from './wallet-ui-account-context-provider';
import { WalletUiClusterContextProvider } from './wallet-ui-cluster-context-provider';
import { WalletUiContextProviderProps } from './wallet-ui-context';
import { WalletUiContextProvider } from './wallet-ui-context-provider';

export interface WalletUiConfig extends Omit<WalletUiContextProviderProps, 'children'> {
    accountStorage?: StorageAccount;
    clusterStorage?: StorageCluster;
    clusters: SolanaCluster[];
}

export function createWalletUiConfig(props: WalletUiConfig): WalletUiConfig {
    return { ...props };
}

export interface WalletUiProps {
    children: React.ReactNode;
    config: WalletUiConfig;
}

export function WalletUi({ children, config: { accountStorage, clusters, clusterStorage, ...config } }: WalletUiProps) {
    return (
        <WalletUiClusterContextProvider
            clusters={clusters}
            storage={clusterStorage}
            render={({ cluster }) => {
                return (
                    <WalletUiAccountContextProvider cluster={cluster} storage={accountStorage}>
                        <WalletUiContextProvider {...config}>{children}</WalletUiContextProvider>
                    </WalletUiAccountContextProvider>
                );
            }}
        />
    );
}
