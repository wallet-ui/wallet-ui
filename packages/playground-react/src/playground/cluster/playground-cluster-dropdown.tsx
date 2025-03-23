import { WalletUiClusterDropdown } from '@wallet-ui/react';
import React from 'react';
import { UiGroup, UiPanel, UiSizes } from '../../ui/';

export function PlaygroundClusterDropdown() {
    return (
        <UiPanel title={<code>WalletUiClusterDropdown</code>}>
            <UiGroup style={{ alignItems: 'flex-start' }}>
                <UiSizes render={size => <WalletUiClusterDropdown size={size} key={size} />} />
            </UiGroup>
        </UiPanel>
    );
}
