import { Network } from '@/features/network/network';
import { Button, View } from 'react-native';
import React from 'react';

export function NetworkUiSelect({
    networks,
    selectedNetwork,
    setSelectedNetwork,
}: {
    networks: Network[];
    selectedNetwork: Network;
    setSelectedNetwork: (network: Network) => void;
}) {
    return (
        <View style={{ gap: 8 }}>
            {networks.map(network => (
                <View key={network.id}>
                    <Button
                        disabled={selectedNetwork.id === network.id}
                        onPress={() => setSelectedNetwork(network)}
                        title={network.name}
                    />
                </View>
            ))}
        </View>
    );
}
