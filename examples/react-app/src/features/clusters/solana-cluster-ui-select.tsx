import { SolanaClusterId, useWalletUiCluster } from '@wallet-ui/react';

export function SolanaClusterUiSelect() {
    const { cluster, clusters, setCluster } = useWalletUiCluster();
    return (
        <select
            onChange={e => {
                if (!setCluster || !e.target.value) {
                    return;
                }
                return setCluster(e.target.value as SolanaClusterId);
            }}
            value={cluster.id}
        >
            {clusters.map(item => (
                <option key={item.id} value={item.id}>
                    {item.label}
                </option>
            ))}
        </select>
    );
}
