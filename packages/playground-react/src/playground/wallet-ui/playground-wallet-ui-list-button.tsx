import { UiWalletAccount, WalletUiListButton } from '@wallet-ui/react';
import React, { useState } from 'react';
import { UiGroup, UiStack, UiWallets } from '../../ui/';

export function PlaygroundWalletUiListButton() {
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
        <UiStack>
            <UiGroup>
                <UiWallets
                    render={wallet => <WalletUiListButton key={wallet.name} wallet={wallet} select={handleSelect} />}
                />
                <pre>{selectedAccount ? selectedAccount.address : pending ? 'Pending...' : ''}</pre>
            </UiGroup>
        </UiStack>
    );
}
