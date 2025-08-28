import { UiWallet, useBaseModal, useWalletUi, WalletUiModal } from '@wallet-ui/react';
import React from 'react';

export function PlaygroundWalletUiModal() {
    const { wallets } = useWalletUi();

    return <TestModal wallets={wallets} />;
}

function TestModal({ wallets }: { wallets: UiWallet[] }) {
    const modal = useBaseModal();

    return (
        <WalletUiModal
            buttonLabel="Select Wallet"
            modal={modal}
            select={async () => {
                await new Promise(resolve => setTimeout(resolve, 1000));
                modal.close();
            }}
            wallets={wallets}
        />
    );
}
