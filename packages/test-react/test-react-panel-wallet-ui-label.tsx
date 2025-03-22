import { WalletUiLabel } from '@wallet-ui/react';
import React from 'react';
import { Group } from './group';
import { Stack } from './stack';
import { TestReactRenderSizes } from './test-react-render-sizes';
import { TestReactRenderWallets } from './test-react-render-wallets';

import { TestReactUiPanel } from './test-react-ui-panel';

export function TestReactPanelWalletUiLabel() {
    return (
        <Group style={{ alignItems: 'flex-start' }}>
            <TestReactRenderSizes
                render={size => (
                    <TestReactUiPanel key={size} title={<code>{size}</code>}>
                        <Stack>
                            <TestReactRenderWallets render={wallet => <WalletUiLabel wallet={wallet} size={size} />} />
                        </Stack>
                    </TestReactUiPanel>
                )}
            />
        </Group>
    );
}
