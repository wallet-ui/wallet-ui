import {
    BaseButton,
    BaseModal,
    UiWallet,
    useBaseModal,
    useWalletUiWallet,
    WalletUiIcon,
    WalletUiLabel,
} from '@wallet-ui/react';
import React from 'react';
import { UiGroup, UiPanel, UiStack } from '../../ui/';

export function PlaygroundWalletSelectorItem({ wallet }: { wallet: UiWallet }) {
    const { isConnecting, isDisconnecting, disconnect, connect } = useWalletUiWallet({ wallet });
    const isConnected = wallet.accounts.length > 0;
    const modal = useBaseModal();
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
            <UiGroup>
                <BaseButton disabled={isConnected} label="Connect" onClick={() => connect()} />
                <BaseButton disabled={!isConnected} label="Disconnect" onClick={() => disconnect()} />
                <BaseModal modal={modal} buttonLabel="Info">
                    <pre
                        style={{
                            fontSize: '0.8rem',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                        }}
                    >
                        {JSON.stringify(
                            {
                                name: wallet.name,
                                version: wallet.version,
                                features: wallet.features,
                                chains: wallet.chains,
                                accounts: wallet.accounts?.map(account => ({
                                    address: account.address,
                                    label: account.label,
                                })),
                            },
                            null,
                            4,
                        )}
                    </pre>
                </BaseModal>
            </UiGroup>

            {isConnecting || isDisconnecting ? <div>Connecting...</div> : null}

            {wallet.accounts?.length ? (
                <UiStack>
                    {wallet.accounts.map(account => (
                        <div key={account.address}>
                            <code>{account.address}</code>
                        </div>
                    ))}
                </UiStack>
            ) : null}
        </UiPanel>
    );
}
