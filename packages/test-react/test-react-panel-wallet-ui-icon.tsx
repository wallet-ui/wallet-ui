import { WalletUiIcon } from '@wallet-ui/react';
import React from 'react';
import { Group } from './group';
import { TestReactRenderSizes } from './test-react-render-sizes';
import { TestReactRenderWallets } from './test-react-render-wallets';
import { TestReactUiPanel } from './test-react-ui-panel';

export function TestReactPanelWalletUiIcon() {
    return (
        <Group style={{ alignItems: 'flex-start' }}>
            <TestReactRenderSizes
                render={size => (
                    <TestReactUiPanel key={size} title={<code>{size}</code>}>
                        <Group>
                            <TestReactRenderWallets render={wallet => <WalletUiIcon wallet={wallet} size={size} />} />
                        </Group>
                    </TestReactUiPanel>
                )}
            />
        </Group>
    );
}
