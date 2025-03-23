import { useWalletUi, WalletUiModalTrigger } from '@wallet-ui/react';
import React from 'react';
import { UiGroup, UiPanel, UiStack } from '../../ui/';

export function PlaygroundWalletUiProvider() {
    const { wallet, wallets, account, dropdown, modal, connected, size } = useWalletUi();
    return (
        <UiStack>
            <UiGroup style={{ alignItems: 'flex-start' }}>
                <UiPanel title={<code>useWalletUi</code>}>
                    <pre>{JSON.stringify({ connected, account, size, dropdown, modal, wallet, wallets }, null, 4)}</pre>
                </UiPanel>
                <WalletUiModalTrigger modal={modal} />
            </UiGroup>
        </UiStack>
    );
}
