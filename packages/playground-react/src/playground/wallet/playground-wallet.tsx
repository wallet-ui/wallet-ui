import React from 'react';
import { UiStack } from '../../ui/';
import { PlaygroundWalletInfo } from './playground-wallet-info';
import { PlaygroundWalletSelector } from './playground-wallet-selector';

export function PlaygroundWallet() {
    return (
        <UiStack>
            <PlaygroundWalletSelector />
            <PlaygroundWalletInfo />
        </UiStack>
    );
}
