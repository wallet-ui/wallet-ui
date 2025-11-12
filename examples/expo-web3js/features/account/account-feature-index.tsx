import { Button, Text, View } from 'react-native';
import { ellipsify } from '@/utils/ellipsify';
import React from 'react';
import { AccountFeatureGetBalance } from '@/features/account/account-feature-get-balance';
import { useSolanaMobile } from '@wallet-ui/react-native-web3js';

export function AccountFeatureIndex() {
    const { account, connect, disconnect } = useSolanaMobile();

    return (
        <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Account</Text>
            <View style={{ gap: 8 }}>
                <Button disabled={!account} title="Disconnect" onPress={disconnect} />
                <Button disabled={!!account} title="Connect" onPress={connect} />
                {account ? (
                    <>
                        <Text>Connected to {ellipsify(account.publicKey.toString(), 8)}</Text>
                        <AccountFeatureGetBalance publicKey={account.publicKey} />
                    </>
                ) : (
                    <Text>Connect your wallet.</Text>
                )}
            </View>
        </View>
    );
}
