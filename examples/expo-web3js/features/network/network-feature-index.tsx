import { useNetwork } from '@/features/network/network-provider';
import { NetworkFeatureGetVersion } from '@/features/network/network-feature-get-version';
import { NetworkFeatureGetGenesisHash } from '@/features/network/network-feature-get-genesis-hash';
import React from 'react';
import { NetworkUiSelect } from '@/features/network/network-ui-select';
import { Text, View } from 'react-native';

export function NetworkFeatureIndex() {
    const { selectedNetwork, networks, setSelectedNetwork } = useNetwork();
    return (
        <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Network</Text>
            <NetworkUiSelect
                networks={networks}
                selectedNetwork={selectedNetwork}
                setSelectedNetwork={setSelectedNetwork}
            />
            <NetworkFeatureGetVersion network={selectedNetwork} />
            <NetworkFeatureGetGenesisHash network={selectedNetwork} />
        </View>
    );
}
