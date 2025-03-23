import { WalletUiIconClose } from '@wallet-ui/react';
import React from 'react';
import { UiGroup, UiPanel, UiSizes } from '../../ui/';

export function PlaygroundWalletUiIconClose() {
    return (
        <UiGroup style={{ alignItems: 'flex-start' }}>
            <UiSizes
                render={size => (
                    <UiPanel key={size} title={<code>{size}</code>}>
                        <WalletUiIconClose size={size} />
                    </UiPanel>
                )}
            />
        </UiGroup>
    );
}
