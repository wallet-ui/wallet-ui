import { UiWalletAccount, WalletUiList } from '@wallet-ui/react';
import React, { useState } from 'react';
import { Group } from './group';

import { PlaygroundUiPanel } from './playground-ui-panel';
import { Stack } from './stack';
import { TestReactRenderSizes } from './test-react-render-sizes';
import { testReactUiStyleBorder } from './test-react-ui-style';
import { useTestWallets } from './test-wallets';

export function TestReactPanelWalletUiList() {
    const wallets = useTestWallets();
    const [selectedAccount, setSelectedWallet] = useState<UiWalletAccount | null>(null);
    const [pending, setPending] = useState(false);

    async function handleSelect(wallet: UiWalletAccount) {
        setSelectedWallet(null);
        setPending(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSelectedWallet(wallet);
        setPending(false);
    }

    return (
        <Group style={{ alignItems: 'flex-start' }}>
            <TestReactRenderSizes
                render={size => (
                    <PlaygroundUiPanel key={size} title={<code>{size}</code>}>
                        <Stack>
                            <div style={{ ...testReactUiStyleBorder }}>
                                <WalletUiList size={size} wallets={wallets} select={handleSelect} />
                            </div>
                            <pre>{selectedAccount ? selectedAccount.address : pending ? 'Pending...' : ''}</pre>
                        </Stack>
                    </PlaygroundUiPanel>
                )}
            />
        </Group>
    );
}
