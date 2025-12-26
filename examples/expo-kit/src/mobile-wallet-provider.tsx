import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit';
import { AppIdentity, Chain } from '@solana-mobile/mobile-wallet-adapter-protocol';
import React, { createContext, type ReactNode, useMemo } from 'react';

export interface MobileWalletProviderProps {
    chain: Chain;
    children: ReactNode;
    config?: SolanaClientConfig;
    configSubscriptions?: SolanaClientConfigSubscriptions;
    endpoint: string;
    endpointSubscriptions?: string;
    identity: AppIdentity;
}
export interface MobileWalletProviderState {
    chain: Chain;
    client: SolanaClient;
    identity: AppIdentity;
}

export type SolanaClient = ReturnType<typeof createSolanaClient>;
export type SolanaClientConfig = Parameters<typeof createSolanaRpc>[1];
export type SolanaClientConfigSubscriptions = Parameters<typeof createSolanaRpcSubscriptions>[1];
export function createSolanaClient({
    config,
    configSubscriptions,
    endpoint,
    endpointSubscriptions,
}: {
    config?: SolanaClientConfig;
    configSubscriptions?: SolanaClientConfigSubscriptions;
    endpoint: string;
    endpointSubscriptions?: string;
}) {
    endpointSubscriptions = endpointSubscriptions ?? endpoint.replace('http', 'ws');
    return {
        rpc: createSolanaRpc(endpoint, config),
        rpcSubscriptions: createSolanaRpcSubscriptions(endpointSubscriptions, configSubscriptions),
    };
}

export const MobileWalletProviderContext = createContext<MobileWalletProviderState>({} as MobileWalletProviderState);
export function MobileWalletProvider({
    children,
    chain,
    config,
    configSubscriptions,
    endpoint,
    endpointSubscriptions,
    identity,
}: MobileWalletProviderProps) {
    const client = useMemo(
        () => createSolanaClient({ endpoint, endpointSubscriptions, config, configSubscriptions }),
        [config, configSubscriptions, endpoint, endpointSubscriptions],
    );

    return (
        <MobileWalletProviderContext.Provider
            value={useMemo(
                () => ({
                    chain,
                    client,
                    identity,
                }),
                [client, identity, chain],
            )}
        >
            {children}
        </MobileWalletProviderContext.Provider>
    );
}
