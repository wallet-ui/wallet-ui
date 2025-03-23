import { WalletUiIconNoWallet } from '@wallet-ui/react';
import React from 'react';
import { UiGroup, UiPanel, UiSizes } from '../../ui/';

export function PlaygroundWalletUiIconNoWallet() {
    return (
        <UiGroup style={{ alignItems: 'flex-start' }}>
            <UiSizes
                render={size => (
                    <UiPanel key={size} title={<code>{size}</code>}>
                        <WalletUiIconNoWallet size={size} />
                    </UiPanel>
                )}
            />
        </UiGroup>
    );
}
