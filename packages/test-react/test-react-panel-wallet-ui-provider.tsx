import { useWalletUi, WalletUiModalTrigger } from '@wallet-ui/react';
import React from 'react';
import { Group } from './group';
import { Stack } from './stack';
import { TestReactUiPanel } from './test-react-ui-panel';

export function TestReactPanelWalletUiProvider() {
    const { wallet, wallets, account, dropdown, modal, connected, size } = useWalletUi();
    return (
        <Stack>
            <Group style={{ alignItems: 'flex-start' }}>
                <TestReactUiPanel title={<code>useWalletUi</code>}>
                    <pre>{JSON.stringify({ connected, account, size, dropdown, modal, wallet, wallets }, null, 4)}</pre>
                </TestReactUiPanel>
                <WalletUiModalTrigger modal={modal} />
            </Group>
        </Stack>
    );
}
