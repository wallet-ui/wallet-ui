import { WalletUiClusterDropdown } from '@wallet-ui/react';
import React from 'react';
import { Group } from './group';
import { PlaygroundUiPanel } from './playground-ui-panel';
import { TestReactRenderSizes } from './test-react-render-sizes';

export function PlaygroundClusterDropdown() {
    return (
        <PlaygroundUiPanel title={<code>WalletUiClusterDropdown</code>}>
            <Group style={{ alignItems: 'flex-start' }}>
                <TestReactRenderSizes render={size => <WalletUiClusterDropdown size={size} key={size} />} />
            </Group>
        </PlaygroundUiPanel>
    );
}
