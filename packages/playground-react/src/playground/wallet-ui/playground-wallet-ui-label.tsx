import { WalletUiLabel } from '@wallet-ui/react';
import React from 'react';
import { UiGroup, UiPanel, UiSizes, UiStack, UiWallets } from '../../ui/';

export function PlaygroundWalletUiLabel() {
    return (
        <UiGroup style={{ alignItems: 'flex-start' }}>
            <UiSizes
                render={size => (
                    <UiPanel key={size} title={<code>{size}</code>}>
                        <UiStack>
                            <UiWallets render={wallet => <WalletUiLabel wallet={wallet} size={size} />} />
                        </UiStack>
                    </UiPanel>
                )}
            />
        </UiGroup>
    );
}
