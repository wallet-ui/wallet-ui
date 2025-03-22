import { WalletUiIconNoWallet } from '@wallet-ui/react';
import React from 'react';
import { Group } from './group';
import { PlaygroundUiPanel } from './playground-ui-panel';
import { TestReactRenderSizes } from './test-react-render-sizes';

export function TestReactPanelWalletUiIconNoWallet() {
    return (
        <Group style={{ alignItems: 'flex-start' }}>
            <TestReactRenderSizes
                render={size => (
                    <PlaygroundUiPanel key={size} title={<code>{size}</code>}>
                        <WalletUiIconNoWallet size={size} />
                    </PlaygroundUiPanel>
                )}
            />
        </Group>
    );
}
