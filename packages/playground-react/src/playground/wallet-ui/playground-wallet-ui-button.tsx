import { WalletUiButton } from '@wallet-ui/react';
import React from 'react';
import { UiGroup, UiPanel, UiSizes } from '../../ui/';

export function PlaygroundWalletUiButton() {
    return (
        <UiGroup style={{ alignItems: 'flex-start' }}>
            <WalletUiButton />
            <UiSizes
                render={size => (
                    <UiPanel key={size} title={<code>{size}</code>}>
                        <UiGroup>{size}</UiGroup>
                    </UiPanel>
                )}
            />
        </UiGroup>
    );
}
