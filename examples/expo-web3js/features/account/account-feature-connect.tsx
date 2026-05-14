import { Button } from 'react-native';
import React from 'react';
import { useMobileWallet } from '@wallet-ui/react-native-web3js';

export function AccountFeatureConnect() {
    const { account, connect, isSupported } = useMobileWallet();

    return <Button disabled={!!account || !isSupported} title="Connect" onPress={connect} />;
}
