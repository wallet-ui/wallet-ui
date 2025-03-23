import { useWalletUiDropdown, WalletUiDropdown } from '@wallet-ui/react';
import React from 'react';
import { UiGroup, UiStack } from '../../ui/';

export function PlaygroundWalletUiDropdown() {
    return (
        <UiStack>
            <UiGroup>
                <TestDropdown />
            </UiGroup>
        </UiStack>
    );
}

function TestDropdown() {
    const { connected } = useWalletUiDropdown({ size: 'sm' });
    return (
        <UiStack>
            <pre>{JSON.stringify({ connected }, null, 4)}</pre>
            <WalletUiDropdown
            //buttonProps={buttonProps}
            // size={size}
            //dropdown={dropdown}
            //items={items} // wallets={wallets}
            // select={async () => {
            //     await new Promise(resolve => setTimeout(resolve, 1000));
            //     modal.close();
            // }}
            />
        </UiStack>
    );
}
