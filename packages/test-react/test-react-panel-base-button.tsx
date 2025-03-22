import { BaseButton, UiWallet, useWalletUiWallets, WalletUiIcon, WalletUiLabel } from '@wallet-ui/react';
import React from 'react';
import { Group } from './group';
import { PlaygroundUiPanel } from './playground-ui-panel';
import { Stack } from './stack';
import { TestReactRenderSizes } from './test-react-render-sizes';
import { TestReactRenderWallets } from './test-react-render-wallets';
import { TestReactUiIconRefresh } from './test-react-ui-icon-refresh';

export function TestReactPanelBaseButton() {
    const [result, setResult] = React.useState('idle');

    const wallets = useWalletUiWallets();
    const [selectedWallet, setSelectedWallet] = React.useState<UiWallet | undefined>(wallets[0]);

    function onClick() {
        setResult(`click at ${new Date().toISOString()}`);
        setTimeout(() => setResult('idle'), 1000);
    }

    return (
        <Stack>
            <TestReactRenderSizes
                render={size => (
                    <PlaygroundUiPanel key={size} title={<code>{size}</code>}>
                        <Stack>
                            <Group>
                                <TestReactRenderWallets
                                    render={wallet => (
                                        <BaseButton
                                            key={wallet.name}
                                            size={size}
                                            disabled={selectedWallet?.name === wallet.name}
                                            onClick={() => setSelectedWallet(wallet)}
                                            label={<WalletUiLabel wallet={wallet} size={size} />}
                                            leftSection={<WalletUiIcon wallet={wallet} size={size} />}
                                        />
                                    )}
                                />
                                <BaseButton
                                    disabled={!selectedWallet}
                                    onClick={() => setSelectedWallet(undefined)}
                                    label="Disconnect"
                                    leftSection={
                                        selectedWallet ? (
                                            <WalletUiIcon wallet={selectedWallet} size={size} />
                                        ) : undefined
                                    }
                                    size={size}
                                />
                            </Group>
                            <Group>
                                <BaseButton size={size} onClick={onClick} label="No Sections" />
                                <BaseButton
                                    size={size}
                                    leftSection={<TestReactUiIconRefresh size={size} />}
                                    onClick={onClick}
                                    label="With Left Section"
                                />
                                <BaseButton
                                    size={size}
                                    rightSection={<TestReactUiIconRefresh size={size} />}
                                    onClick={onClick}
                                    label="With Right Section"
                                />
                                <pre>{JSON.stringify(result.length ? result : undefined, null, 4)}</pre>
                            </Group>
                        </Stack>
                    </PlaygroundUiPanel>
                )}
            />
        </Stack>
    );
}
