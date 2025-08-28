import { WalletUiLabel } from '@wallet-ui/react';
import React from 'react';
import { UiGroup, UiStack, UiWallets } from '../../ui/';

export function PlaygroundWalletUiLabel() {
    return (
        <UiGroup style={{ alignItems: 'flex-start' }}>
            <UiStack>
                <UiWallets render={wallet => <WalletUiLabel key={wallet.name} wallet={wallet} />} />
            </UiStack>
        </UiGroup>
    );
}
