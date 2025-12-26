import { useQuery } from '@tanstack/react-query';
import { useMobileWallet } from '@/src';

export function useNetworkGetGenesisHash() {
    const { chain, connection } = useMobileWallet();
    return useQuery({
        queryKey: ['getGenesisHash', chain],
        queryFn: () => connection.getGenesisHash(),
    });
}
