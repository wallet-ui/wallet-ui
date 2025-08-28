import { useWalletUi } from '@wallet-ui/react';
import React from 'react';
import { UiGroup, UiPanel, UiStack } from '../../ui/';

export function PlaygroundWalletUiProvider() {
    const { wallet, wallets, account, connected } = useWalletUi();
    return (
        <UiStack>
            <UiGroup style={{ alignItems: 'flex-start' }}>
                <UiPanel title={<code>useWalletUi</code>}>
                    <pre>{JSON.stringify({ connected, wallet, account, wallets }, null, 4)}</pre>
                </UiPanel>
            </UiGroup>
        </UiStack>
    );
}
