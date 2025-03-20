import { WalletUiListItem, WalletUiWallet } from '@wallet-ui/react';
import React, { useState } from 'react';
import { Group } from './group';
import { Stack } from './stack';
import { TestReactRenderSizes } from './test-react-render-sizes';
import { TestReactRenderWallets } from './test-react-render-wallets';

import { TestReactUiPanel } from './test-react-ui-panel';

export function TestReactPanelWalletUiListItem() {
    const [selectedWallet, setSelectedWallet] = useState<WalletUiWallet | null>(null);
    const [pending, setPending] = useState(false);

    async function handleSelect(wallet: WalletUiWallet) {
        setSelectedWallet(null);
        setPending(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSelectedWallet(wallet);
        setPending(false);
    }

    return (
        <Stack>
            <TestReactRenderSizes
                render={size => (
                    <TestReactUiPanel key={size} title={<code>{size}</code>}>
                        <Group>
                            <TestReactRenderWallets
                                render={wallet => (
                                    <WalletUiListItem
                                        key={wallet.name}
                                        size={size}
                                        wallet={wallet}
                                        select={handleSelect}
                                    />
                                )}
                            />
                            <pre>{selectedWallet ? selectedWallet.name : pending ? 'Pending...' : ''}</pre>
                        </Group>
                    </TestReactUiPanel>
                )}
            />
        </Stack>
    );
}
