import { useWalletUi } from '@wallet-ui/react';
import React from 'react';

import { PlaygroundWalletSelectorItem } from './playground-wallet-selector-item';
import { Stack } from './stack';

export function PlaygroundWalletSelector() {
    const { wallets } = useWalletUi();

    return (
        <Stack>
            {wallets.map(wallet => (
                <PlaygroundWalletSelectorItem wallet={wallet} key={wallet.name} />
            ))}
        </Stack>
    );
}
