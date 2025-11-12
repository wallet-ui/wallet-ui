import { Network } from '@/features/network/network';
import { useConnection } from '@/features/solana/solana-provider';
import { useQuery } from '@tanstack/react-query';

export function useNetworkGetGenesisHash({ network }: { network: Network }) {
    const connection = useConnection();
    return useQuery({
        queryKey: ['get-genesis-hash', network.id],
        queryFn: () => connection.getGenesisHash(),
    });
}
