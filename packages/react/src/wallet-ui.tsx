import { SolanaCluster } from '@wallet-ui/core';
import React from 'react';

import { WalletUiAccountContextProvider } from './wallet-ui-account-context-provider';
import { WalletUiClusterContextProvider } from './wallet-ui-cluster-context-provider';
import { WalletUiContextProviderProps } from './wallet-ui-context';
import { WalletUiContextProvider } from './wallet-ui-context-provider';
import { WalletUiSolanaClientContextProvider } from './wallet-ui-solana-client-context-provider';

export interface WalletUiConfig extends Omit<WalletUiContextProviderProps, 'children'> {
    clusterStorageKey?: string;
    clusters: SolanaCluster[];
    selectedAccountStorageKey?: string;
}

export function createWalletUiConfig(props: WalletUiConfig): WalletUiConfig {
    return { ...props };
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
            <WalletUiClusterContextProvider
                clusters={clusters}
                storageKey={clusterStorageKey}
                render={({ cluster }) => {
                    return (
                        <WalletUiSolanaClientContextProvider urlOrMoniker={cluster.urlOrMoniker}>
                            <WalletUiAccountContextProvider storageKey={selectedAccountStorageKey}>
                                <WalletUiContextProvider {...config}>{children}</WalletUiContextProvider>
                            </WalletUiAccountContextProvider>
                        </WalletUiSolanaClientContextProvider>
                    );
                }}
            />
        </React.Fragment>
    );
}
