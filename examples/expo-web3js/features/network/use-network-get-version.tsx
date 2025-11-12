import { Network } from '@/features/network/network';
import { useConnection } from '@/features/solana/solana-provider';
import { useQuery } from '@tanstack/react-query';

export function useNetworkGetVersion({ network }: { network: Network }) {
    const connection = useConnection();
    return useQuery({
        queryKey: ['get-version', network.id],
        queryFn: () =>
            connection
                .getVersion()
                .then(version => ({ core: version['solana-core'], features: version['feature-set'] })),
    });
}
