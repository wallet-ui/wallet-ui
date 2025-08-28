import { UiWalletAccount, useWalletUi, WalletUiList } from '@wallet-ui/react';
import React, { useState } from 'react';
import { UiStack, uiStyleBorder } from '../../ui/';

export function PlaygroundWalletUiList() {
    const { wallets } = useWalletUi();
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
        <UiStack>
            <div style={{ ...uiStyleBorder }}>
                <WalletUiList wallets={wallets} select={handleSelect} />
            </div>
            <pre>{selectedAccount ? selectedAccount.address : pending ? 'Pending...' : ''}</pre>
        </UiStack>
    );
}
