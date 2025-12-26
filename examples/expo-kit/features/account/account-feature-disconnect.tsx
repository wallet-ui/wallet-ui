import { Button } from 'react-native';
import React from 'react';
import { useMobileWallet } from '@/src';

export function AccountFeatureDisconnect() {
    const { account, disconnect } = useMobileWallet();

    return <Button disabled={!account} title="Disconnect" onPress={disconnect} />;
}
