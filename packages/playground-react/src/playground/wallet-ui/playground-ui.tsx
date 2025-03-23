import React from 'react';
import { UiStack } from '../../ui/';
import { PlaygroundWalletUi } from './playground-wallet-ui';

export function PlaygroundUi() {
    return (
        <UiStack>
            <PlaygroundWalletUi />
        </UiStack>
    );
}
