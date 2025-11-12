import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { AppConfig } from '@/constants/app-config';
import { Network, NetworkCluster } from './network';

export interface NetworkProviderContext {
    getExplorerUrl(path: string): string;
    networks: Network[];
    selectedNetwork: Network;
    setSelectedNetwork: (cluster: Network) => void;
}

const Context = createContext<NetworkProviderContext>({} as NetworkProviderContext);

export function NetworkProvider({ children }: { children: ReactNode }) {
    const [selectedNetwork, setSelectedNetwork] = useState<Network>(AppConfig.networks[0]);
    const value: NetworkProviderContext = useMemo(
        () => ({
            selectedNetwork,
            networks: [...AppConfig.networks].sort((a, b) => a.name.localeCompare(b.name)),
            setSelectedNetwork: (cluster: Network) => setSelectedNetwork(cluster),
            getExplorerUrl: (path: string) =>
                `https://explorer.solana.com/${path}${getClusterUrlParam(selectedNetwork)}`,
        }),
        [selectedNetwork, setSelectedNetwork],
    );
    return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useNetwork() {
    return useContext(Context);
}

function getClusterUrlParam(cluster: Network): string {
    switch (cluster.cluster) {
        case NetworkCluster.Devnet:
            return `?cluster=devnet`;
        case NetworkCluster.Mainnet:
            return '';
        case NetworkCluster.Testnet:
            return `?cluster=testnet`;
        default:
            return `?cluster=custom&customUrl=${encodeURIComponent(cluster.endpoint)}`;
    }
}
