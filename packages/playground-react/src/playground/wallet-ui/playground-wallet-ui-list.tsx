import { UiWalletAccount, WalletUiList } from '@wallet-ui/react';
import React, { useState } from 'react';
import { testReactUiStyleBorder, UiGroup, UiPanel, UiSizes, UiStack } from '../../ui/';
import { useTestWallets } from '../../util/test-wallets';

export function PlaygroundWalletUiList() {
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
        <UiGroup style={{ alignItems: 'flex-start' }}>
            <UiSizes
                render={size => (
                    <UiPanel key={size} title={<code>{size}</code>}>
                        <UiStack>
                            <div style={{ ...testReactUiStyleBorder }}>
                                <WalletUiList size={size} wallets={wallets} select={handleSelect} />
                            </div>
                            <pre>{selectedAccount ? selectedAccount.address : pending ? 'Pending...' : ''}</pre>
                        </UiStack>
                    </UiPanel>
                )}
            />
        </UiGroup>
    );
}
