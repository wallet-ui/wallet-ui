import { BaseButton, UiWallet, useWalletUiWallet, WalletUiIcon, WalletUiLabel } from '@wallet-ui/react';
import React from 'react';
import { Group } from './group';
import { PlaygroundUiPanel } from './playground-ui-panel';
import { Stack } from './stack';

export function PlaygroundWalletSelectorItem({ wallet }: { wallet: UiWallet }) {
    const { isConnecting, isDisconnecting, disconnect, connect } = useWalletUiWallet({ wallet });

    return (
        <PlaygroundUiPanel
            key={wallet.name}
            title={
                <Group>
                    <WalletUiIcon wallet={wallet} />
                    <WalletUiLabel wallet={wallet} />
                </Group>
            }
        >
            {isConnecting || isDisconnecting ? <div>Connecting...</div> : null}

            {wallet.accounts?.length ? (
                <Stack>
                    {wallet.accounts.map(account => (
                        <div key={account.address}>
                            <code>{account.address}</code>
                        </div>
                    ))}
                </Stack>
            ) : (
                <div>
                    <BaseButton label="Connect" onClick={() => connect()} />
                </div>
            )}
            <Group>
                <BaseButton label="Connect" onClick={() => connect()} />
                <BaseButton label="Disconnect" onClick={() => disconnect()} />
            </Group>
        </PlaygroundUiPanel>
    );
}
