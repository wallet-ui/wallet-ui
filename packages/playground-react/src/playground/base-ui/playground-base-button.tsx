import { BaseButton, UiWallet, useWalletUiWallets, WalletUiIcon, WalletUiLabel } from '@wallet-ui/react';
import React from 'react';
import { UiGroup, UiIconRefresh, UiStack, UiWallets } from '../../ui/';

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
            <UiGroup>
                <UiWallets
                    render={wallet => (
                        <BaseButton
                            key={wallet.name}
                            disabled={selectedWallet?.name === wallet.name}
                            onClick={() => setSelectedWallet(wallet)}
                            label={<WalletUiLabel wallet={wallet} />}
                            leftSection={<WalletUiIcon wallet={wallet} />}
                        />
                    )}
                />
                <BaseButton
                    disabled={!selectedWallet}
                    onClick={() => setSelectedWallet(undefined)}
                    label="Disconnect"
                    leftSection={selectedWallet ? <WalletUiIcon wallet={selectedWallet} /> : undefined}
                />
            </UiGroup>
            <UiGroup>
                <BaseButton onClick={onClick} label="No Sections" />
                <BaseButton leftSection={<UiIconRefresh />} onClick={onClick} label="With Left Section" />
                <BaseButton rightSection={<UiIconRefresh />} onClick={onClick} label="With Right Section" />
                <pre>{JSON.stringify(result.length ? result : undefined, null, 4)}</pre>
            </UiGroup>
        </UiStack>
    );
}
