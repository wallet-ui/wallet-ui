import React from 'react';
import { Text, View } from 'react-native';
import { NetworkFeatureGetVersion } from './network-feature-get-version';
import { NetworkFeatureGetGenesisHash } from './network-feature-get-genesis-hash';
import { NetworkUiSelect } from './network-ui-select';
import { useNetwork } from './use-network';

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
            <NetworkFeatureGetVersion />
            <NetworkFeatureGetGenesisHash />
        </View>
    );
}
