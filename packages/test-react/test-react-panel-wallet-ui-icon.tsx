import { WalletUiIcon } from '@wallet-ui/react';
import React from 'react';
import { Group } from './group';
import { PlaygroundUiPanel } from './playground-ui-panel';
import { TestReactRenderSizes } from './test-react-render-sizes';
import { TestReactRenderWallets } from './test-react-render-wallets';

export function TestReactPanelWalletUiIcon() {
    return (
        <Group style={{ alignItems: 'flex-start' }}>
            <TestReactRenderSizes
                render={size => (
                    <PlaygroundUiPanel key={size} title={<code>{size}</code>}>
                        <Group>
                            <TestReactRenderWallets render={wallet => <WalletUiIcon wallet={wallet} size={size} />} />
                        </Group>
                    </PlaygroundUiPanel>
                )}
            />
        </Group>
    );
}
