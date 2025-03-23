import { BaseButton, UiWallet, useWalletUiWallet, WalletUiIcon, WalletUiLabel } from '@wallet-ui/react';
import React from 'react';
import { UiGroup, UiPanel, UiStack } from '../../ui/';

export function PlaygroundWalletSelectorItem({ wallet }: { wallet: UiWallet }) {
    const { isConnecting, isDisconnecting, disconnect, connect } = useWalletUiWallet({ wallet });

    return (
        <UiPanel
            key={wallet.name}
            title={
                <UiGroup>
                    <WalletUiIcon wallet={wallet} />
                    <WalletUiLabel wallet={wallet} />
                </UiGroup>
            }
        >
            {isConnecting || isDisconnecting ? <div>Connecting...</div> : null}

            {wallet.accounts?.length ? (
                <UiStack>
                    {wallet.accounts.map(account => (
                        <div key={account.address}>
                            <code>{account.address}</code>
                        </div>
                    ))}
                </UiStack>
            ) : (
                <div>
                    <BaseButton label="Connect" onClick={() => connect()} />
                </div>
            )}
            <UiGroup>
                <BaseButton label="Connect" onClick={() => connect()} />
                <BaseButton label="Disconnect" onClick={() => disconnect()} />
            </UiGroup>
        </UiPanel>
    );
}
