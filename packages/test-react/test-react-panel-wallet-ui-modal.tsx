import { UiWallet, useBaseModal, WalletUiModal, WalletUiSize } from '@wallet-ui/react';
import React from 'react';
import { Group } from './group';
import { PlaygroundUiPanel } from './playground-ui-panel';
import { Stack } from './stack';
import { TestReactRenderSizes } from './test-react-render-sizes';
import { useTestWallets } from './test-wallets';

export function TestReactPanelWalletUiModal() {
    const wallets = useTestWallets();

    return (
        <Stack>
            <Group>
                <TestReactRenderSizes
                    render={size => (
                        <PlaygroundUiPanel key={size} title={<code>{size}</code>}>
                            <TestModal size={size} wallets={wallets} />
                        </PlaygroundUiPanel>
                    )}
                />
            </Group>
        </Stack>
    );
}

function TestModal({ size, wallets }: { size: WalletUiSize; wallets: UiWallet[] }) {
    const modal = useBaseModal();

    return (
        <WalletUiModal
            buttonLabel="Select Wallet"
            size={size}
            modal={modal}
            select={async () => {
                await new Promise(resolve => setTimeout(resolve, 1000));
                modal.close();
            }}
            wallets={wallets}
        />
    );
}
