import { useWalletUiDropdown, WalletUiDropdown } from '@wallet-ui/react';
import React from 'react';
import { Group } from './group';
import { Stack } from './stack';

export function TestReactPanelWalletUiDropdown() {
    return (
        <Stack>
            <Group>
                <TestDropdown />
            </Group>
        </Stack>
    );
}

function TestDropdown() {
    const { buttonProps, connected, dropdown, items, label } = useWalletUiDropdown();
    return (
        <Stack>
            <pre>{JSON.stringify({ connected, label }, null, 4)}</pre>
            <WalletUiDropdown
                buttonProps={buttonProps}
                // size={size}
                dropdown={dropdown}
                buttonLabel={label}
                items={items} // wallets={wallets}
                // select={async () => {
                //     await new Promise(resolve => setTimeout(resolve, 1000));
                //     modal.close();
                // }}
            />
        </Stack>
    );
}
