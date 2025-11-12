import { ellipsify } from '@/utils/ellipsify';
import { Network } from './network';
import { useNetworkGetGenesisHash } from '@/features/network/use-network-get-genesis-hash';
import { Text } from 'react-native';

export function NetworkFeatureGetGenesisHash({ network }: { network: Network }) {
    const { data, isLoading } = useNetworkGetGenesisHash({ network });

    return <Text>Genesis Hash: {isLoading ? 'Loading...' : `${ellipsify(data, 8)}`}</Text>;
}
