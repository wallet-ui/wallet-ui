import { useWalletUi, WalletUiModalTrigger } from '@wallet-ui/react';
import React from 'react';
import { Group } from './group';
import { PlaygroundUiPanel } from './playground-ui-panel';
import { Stack } from './stack';

export function TestReactPanelWalletUiProvider() {
    const { wallet, wallets, account, dropdown, modal, connected, size } = useWalletUi();
    return (
        <Stack>
            <Group style={{ alignItems: 'flex-start' }}>
                <PlaygroundUiPanel title={<code>useWalletUi</code>}>
                    <pre>{JSON.stringify({ connected, account, size, dropdown, modal, wallet, wallets }, null, 4)}</pre>
                </PlaygroundUiPanel>
                <WalletUiModalTrigger modal={modal} />
            </Group>
        </Stack>
    );
}
