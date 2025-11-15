import { useQuery } from '@tanstack/react-query';
import { useSolanaMobile } from '@wallet-ui/react-native-web3js';

export function useNetworkGetGenesisHash() {
    const { clusterId, connection } = useSolanaMobile();
    return useQuery({
        queryKey: ['getGenesisHash', clusterId],
        queryFn: () => connection.getGenesisHash(),
    });
}
