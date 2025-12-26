import { useQuery } from '@tanstack/react-query';
import { useMobileWallet } from '@/src';

export function useNetworkGetVersion() {
    const { chain, connection } = useMobileWallet();
    return useQuery({
        queryKey: ['getVersion', chain],
        queryFn: () =>
            connection
                .getVersion()
                .then(version => ({ core: version['solana-core'], features: version['feature-set'] })),
    });
}
