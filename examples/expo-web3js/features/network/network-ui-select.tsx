import { Button, View } from 'react-native';
import React from 'react';
import { SolanaCluster } from '@wallet-ui/react-native-web3js';

export function NetworkUiSelect({
    networks,
    selectedNetwork,
    setSelectedNetwork,
}: {
    networks: SolanaCluster[];
    selectedNetwork: SolanaCluster;
    setSelectedNetwork: (network: SolanaCluster) => void;
}) {
    return (
        <View style={{ gap: 8 }}>
            {networks.map(network => (
                <View key={network.id}>
                    <Button
                        disabled={selectedNetwork.id === network.id}
                        onPress={() => setSelectedNetwork(network)}
                        title={network.label}
                    />
                </View>
            ))}
        </View>
    );
}
