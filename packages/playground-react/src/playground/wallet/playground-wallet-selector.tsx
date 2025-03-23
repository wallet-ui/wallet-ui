import { useWalletUi } from '@wallet-ui/react';
import React from 'react';
import { UiStack } from '../../ui/';

import { PlaygroundWalletSelectorItem } from './playground-wallet-selector-item';

export function PlaygroundWalletSelector() {
    const { wallets } = useWalletUi();

    return (
        <UiStack style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {wallets.map(wallet => (
                <PlaygroundWalletSelectorItem wallet={wallet} key={wallet.name} />
            ))}
        </UiStack>
    );
}
