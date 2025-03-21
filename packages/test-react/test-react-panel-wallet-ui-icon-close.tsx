import { WalletUiIconClose } from '@wallet-ui/react';
import React from 'react';
import { Group } from './group';
import { TestReactRenderSizes } from './test-react-render-sizes';
import { TestReactUiPanel } from './test-react-ui-panel';

export function TestReactPanelWalletUiIconClose() {
    return (
        <Group style={{ alignItems: 'flex-start' }}>
            <TestReactRenderSizes
                render={size => (
                    <TestReactUiPanel key={size} title={<code>{size}</code>}>
                        <WalletUiIconClose size={size} />
                    </TestReactUiPanel>
                )}
            />
        </Group>
    );
}
