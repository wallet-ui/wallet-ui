import { useQuery } from '@tanstack/react-query';
import { useSolanaMobile } from '@wallet-ui/react-native-web3js';

export function useNetworkGetVersion() {
    const { clusterId, connection } = useSolanaMobile();
    return useQuery({
        queryKey: ['getVersion', clusterId],
        queryFn: () =>
            connection
                .getVersion()
                .then(version => ({ core: version['solana-core'], features: version['feature-set'] })),
    });
}
