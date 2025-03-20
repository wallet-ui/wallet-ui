import { BaseButton, WalletUiIcon, WalletUiLabel, type WalletUiWallet } from '@wallet-ui/react';
import React from 'react';
import { Group } from './group';
import { Stack } from './stack';
import { TestReactRenderSizes } from './test-react-render-sizes';
import { TestReactRenderWallets } from './test-react-render-wallets';
import { TestReactUiIconRefresh } from './test-react-ui-icon-refresh';
import { TestReactUiPanel } from './test-react-ui-panel';
import { useTestWallets } from './test-wallets';

export function TestReactPanelBaseButton() {
    const [result, setResult] = React.useState('idle');

    const wallets = useTestWallets();
    const [selectedWallet, setSelectedWallet] = React.useState<WalletUiWallet | undefined>(wallets[0]);

    function onClick() {
        setResult(`click at ${new Date().toISOString()}`);
        setTimeout(() => setResult('idle'), 1000);
    }

    return (
        <Stack>
            <TestReactRenderSizes
                render={size => (
                    <TestReactUiPanel key={size} title={<code>size = {size}</code>}>
                        <Stack>
                            <Group>
                                <TestReactRenderWallets
                                    render={wallet => (
                                        <BaseButton
                                            key={wallet.name}
                                            size={size}
                                            disabled={selectedWallet?.name === wallet.name}
                                            onClick={() => setSelectedWallet(wallet)}
                                            leftSection={<WalletUiIcon wallet={wallet} size={size} />}
                                        >
                                            <WalletUiLabel wallet={wallet} size={size} />
                                        </BaseButton>
                                    )}
                                />

                                <BaseButton
                                    disabled={!selectedWallet}
                                    onClick={() => setSelectedWallet(undefined)}
                                    leftSection={
                                        selectedWallet ? (
                                            <WalletUiIcon wallet={selectedWallet} size={size} />
                                        ) : undefined
                                    }
                                    size={size}
                                >
                                    Disconnect
                                </BaseButton>
                            </Group>
                            <Group>
                                <BaseButton size={size} onClick={onClick}>
                                    No Sections
                                </BaseButton>
                                <BaseButton
                                    size={size}
                                    leftSection={<TestReactUiIconRefresh size={size} />}
                                    onClick={onClick}
                                >
                                    With Left Section
                                </BaseButton>
                                <BaseButton
                                    size={size}
                                    rightSection={<TestReactUiIconRefresh size={size} />}
                                    onClick={onClick}
                                >
                                    With Right Section
                                </BaseButton>
                                <pre>{JSON.stringify(result.length ? result : undefined, null, 4)}</pre>
                            </Group>
                        </Stack>
                    </TestReactUiPanel>
                )}
            />
        </Stack>
    );
}
