import { UiWallet, useBaseModal, useWalletUi, WalletUiModal, WalletUiSize } from '@wallet-ui/react';
import React from 'react';
import { UiGroup, UiPanel, UiSizes, UiStack } from '../../ui';

export function PlaygroundWalletUiModal() {
    const { wallets } = useWalletUi();

    return (
        <UiStack>
            <UiGroup>
                <UiSizes
                    render={size => (
                        <UiPanel key={size} title={<code>{size}</code>}>
                            <TestModal size={size} wallets={wallets} />
                        </UiPanel>
                    )}
                />
            </UiGroup>
        </UiStack>
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
