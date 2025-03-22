import { UiWalletAccount, WalletUiListButton } from '@wallet-ui/react';
import React, { useState } from 'react';
import { Group } from './group';

import { PlaygroundUiPanel } from './playground-ui-panel';
import { Stack } from './stack';
import { TestReactRenderSizes } from './test-react-render-sizes';
import { TestReactRenderWallets } from './test-react-render-wallets';

export function TestReactPanelWalletUiListButton() {
    const [selectedAccount, setSelectedWallet] = useState<UiWalletAccount | null>(null);
    const [pending, setPending] = useState(false);

    async function handleSelect(account: UiWalletAccount) {
        setSelectedWallet(null);
        setPending(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSelectedWallet(account);
        setPending(false);
    }

    return (
        <Stack>
            <TestReactRenderSizes
                render={size => (
                    <PlaygroundUiPanel key={size} title={<code>{size}</code>}>
                        <Group>
                            <TestReactRenderWallets
                                render={wallet => (
                                    <WalletUiListButton
                                        key={wallet.name}
                                        size={size}
                                        wallet={wallet}
                                        select={handleSelect}
                                    />
                                )}
                            />
                            <pre>{selectedAccount ? selectedAccount.address : pending ? 'Pending...' : ''}</pre>
                        </Group>
                    </PlaygroundUiPanel>
                )}
            />
        </Stack>
    );
}
