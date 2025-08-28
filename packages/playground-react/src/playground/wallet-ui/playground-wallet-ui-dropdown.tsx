import { useWalletUiDropdown, WalletUiDropdown } from '@wallet-ui/react';
import React from 'react';
import { UiStack } from '../../ui/';

export function PlaygroundWalletUiDropdown() {
    return <TestDropdown />;
}

function TestDropdown() {
    const { connected } = useWalletUiDropdown();
    return (
        <UiStack>
            <pre>{JSON.stringify({ connected }, null, 4)}</pre>
            <WalletUiDropdown

            //buttonProps={buttonProps}
            //
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
