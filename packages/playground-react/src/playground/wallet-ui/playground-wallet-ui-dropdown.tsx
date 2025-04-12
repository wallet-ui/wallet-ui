import { useWalletUiDropdown, WalletUiDropdown, WalletUiSize } from '@wallet-ui/react';
import React from 'react';
import { UiGroup, UiSizes, UiStack } from '../../ui/';

export function PlaygroundWalletUiDropdown() {
    return (
        <UiStack>
            <UiGroup>
                <UiSizes render={size => <TestDropdown size={size} />} />
            </UiGroup>
        </UiStack>
    );
}

function TestDropdown({ size }: { size: WalletUiSize }) {
    const { connected } = useWalletUiDropdown({ size });
    return (
        <UiStack>
            <pre>{JSON.stringify({ connected }, null, 4)}</pre>
            <WalletUiDropdown
                size={size}
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
