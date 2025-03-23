import { WalletUiIcon } from '@wallet-ui/react';
import React from 'react';
import { UiGroup, UiPanel, UiSizes, UiWallets } from '../../ui/';

export function PlaygroundWalletUiIcon() {
    return (
        <UiGroup style={{ alignItems: 'flex-start' }}>
            <UiSizes
                render={size => (
                    <UiPanel key={size} title={<code>{size}</code>}>
                        <UiGroup>
                            <UiWallets render={wallet => <WalletUiIcon wallet={wallet} size={size} />} />
                        </UiGroup>
                    </UiPanel>
                )}
            />
        </UiGroup>
    );
}
