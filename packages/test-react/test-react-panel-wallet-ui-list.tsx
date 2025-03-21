import { UiWallet, WalletUiList } from '@wallet-ui/react';
import React, { useState } from 'react';
import { Group } from './group';
import { Stack } from './stack';
import { TestReactRenderSizes } from './test-react-render-sizes';

import { TestReactUiPanel } from './test-react-ui-panel';
import { testReactUiStyleBorder } from './test-react-ui-style';
import { useTestWallets } from './test-wallets';

export function TestReactPanelWalletUiList() {
    const wallets = useTestWallets();
    const [selectedWallet, setSelectedWallet] = useState<UiWallet | null>(null);
    const [pending, setPending] = useState(false);

    async function handleSelect(wallet: UiWallet) {
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
                    <TestReactUiPanel key={size} title={<code>{size}</code>}>
                        <Stack>
                            <div style={{ ...testReactUiStyleBorder }}>
                                <WalletUiList size={size} wallets={wallets} select={handleSelect} />
                            </div>
                            <pre>{selectedWallet ? selectedWallet.name : pending ? 'Pending...' : ''}</pre>
                        </Stack>
                    </TestReactUiPanel>
                )}
            />
        </Group>
    );
}
