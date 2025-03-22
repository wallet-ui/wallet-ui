import { WalletUiClusterDropdown } from '@wallet-ui/react';
import React from 'react';
import { Group } from './group';
import { TestReactRenderSizes } from './test-react-render-sizes';
import { TestReactUiPanel } from './test-react-ui-panel';

export function PlaygroundWalletUiClusterDropdown() {
    return (
        <Group style={{ alignItems: 'flex-start' }}>
            <TestReactRenderSizes
                render={size => (
                    <TestReactUiPanel key={size} title={<code>{size}</code>}>
                        <WalletUiClusterDropdown size={size} />
                    </TestReactUiPanel>
                )}
            />
        </Group>
    );
}
