import React from 'react';
import { UiStack } from '../../ui/';
import { PlaygroundWalletSelector } from './playground-wallet-selector';

export function PlaygroundWallet() {
    return (
        <UiStack>
            <PlaygroundWalletSelector />
        </UiStack>
    );
}
