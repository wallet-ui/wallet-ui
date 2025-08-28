import { WalletUiIcon } from '@wallet-ui/react';
import React from 'react';
import { UiGroup, UiWallets } from '../../ui/';

export function PlaygroundWalletUiIcon() {
    return (
        <UiGroup style={{ alignItems: 'flex-start' }}>
            <UiGroup>
                <UiWallets render={wallet => <WalletUiIcon wallet={wallet} />} />
            </UiGroup>
        </UiGroup>
    );
}
