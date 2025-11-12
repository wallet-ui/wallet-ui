import { NetworkFeatureIndex } from '@/features/network/network-feature-index';
import { AccountFeatureIndex } from '@/features/account/account-feature-index';
import { AppConfig } from '@/constants/app-config';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';

export default function HomeScreen() {
    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, gap: 16, paddingHorizontal: 16 }}>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>App Config</Text>
                    <Text>
                        Name <Text style={{ fontWeight: 'bold' }}>{AppConfig.name}</Text>
                    </Text>
                    <Text>
                        URL <Text style={{ fontWeight: 'bold' }}>{AppConfig.uri}</Text>
                    </Text>
                </View>
                <AccountFeatureIndex />
                <NetworkFeatureIndex />
            </SafeAreaView>
        </View>
    );
}
