import React from 'react';
import { PlaygroundWalletSelector } from './playground-wallet-selector';
import { Stack } from './stack';

export function PlaygroundWallet() {
    return (
        <Stack>
            <PlaygroundWalletSelector />
        </Stack>
    );
}