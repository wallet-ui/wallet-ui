import { Network } from './network';
import { useNetworkGetVersion } from '@/features/network/use-network-get-version';
import { Text } from 'react-native';

export function NetworkFeatureGetVersion({ network }: { network: Network }) {
    const { data, isLoading } = useNetworkGetVersion({ network });

    return <Text>Version: {isLoading ? 'Loading...' : `${data?.core} (${data?.features})`}</Text>;
}
