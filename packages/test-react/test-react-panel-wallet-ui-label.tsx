import { WalletUiLabel } from '@wallet-ui/react';
import React from 'react';
import { Group } from './group';

import { PlaygroundUiPanel } from './playground-ui-panel';
import { Stack } from './stack';
import { TestReactRenderSizes } from './test-react-render-sizes';
import { TestReactRenderWallets } from './test-react-render-wallets';

export function TestReactPanelWalletUiLabel() {
    return (
        <Group style={{ alignItems: 'flex-start' }}>
            <TestReactRenderSizes
                render={size => (
                    <PlaygroundUiPanel key={size} title={<code>{size}</code>}>
                        <Stack>
                            <TestReactRenderWallets render={wallet => <WalletUiLabel wallet={wallet} size={size} />} />
                        </Stack>
                    </PlaygroundUiPanel>
                )}
            />
        </Group>
    );
}
