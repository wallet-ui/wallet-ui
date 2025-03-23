import { BaseButton, UiWallet, useWalletUiWallets, WalletUiIcon, WalletUiLabel } from '@wallet-ui/react';
import React from 'react';
import { UiGroup, UiIconRefresh, UiPanel, UiSizes, UiStack, UiWallets } from '../../ui/';

export function PlaygroundBaseButton() {
    const [result, setResult] = React.useState('idle');

    const wallets = useWalletUiWallets();
    const [selectedWallet, setSelectedWallet] = React.useState<UiWallet | undefined>(wallets[0]);

    function onClick() {
        setResult(`click at ${new Date().toISOString()}`);
        setTimeout(() => setResult('idle'), 1000);
    }

    return (
        <UiStack>
            <UiSizes
                render={size => (
                    <UiPanel key={size} title={<code>{size}</code>}>
                        <UiStack>
                            <UiGroup>
                                <UiWallets
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
                            </UiGroup>
                            <UiGroup>
                                <BaseButton size={size} onClick={onClick} label="No Sections" />
                                <BaseButton
                                    size={size}
                                    leftSection={<UiIconRefresh size={size} />}
                                    onClick={onClick}
                                    label="With Left Section"
                                />
                                <BaseButton
                                    size={size}
                                    rightSection={<UiIconRefresh size={size} />}
                                    onClick={onClick}
                                    label="With Right Section"
                                />
                                <pre>{JSON.stringify(result.length ? result : undefined, null, 4)}</pre>
                            </UiGroup>
                        </UiStack>
                    </UiPanel>
                )}
            />
        </UiStack>
    );
}
