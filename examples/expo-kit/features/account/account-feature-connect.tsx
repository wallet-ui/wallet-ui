import { Button } from 'react-native';
import React from 'react';
import { useMobileWallet } from '@/src';

export function AccountFeatureConnect() {
    const { account, connect } = useMobileWallet();

    return <Button disabled={!!account} title="Connect" onPress={connect} />;
}
