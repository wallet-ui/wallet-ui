import { WalletUiButton } from '@wallet-ui/react';
import React from 'react';
import { Group } from './group';
import { PlaygroundUiPanel } from './playground-ui-panel';
import { TestReactRenderSizes } from './test-react-render-sizes';

export function TestReactPanelWalletUiButton() {
    return (
        <Group style={{ alignItems: 'flex-start' }}>
            <WalletUiButton />

            <TestReactRenderSizes
                render={size => (
                    <PlaygroundUiPanel key={size} title={<code>{size}</code>}>
                        <Group>{size}</Group>
                    </PlaygroundUiPanel>
                )}
            />
        </Group>
    );
}
