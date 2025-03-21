// import './solana-wallet-ui-dialog.css';

import { UiWallet, useConnect, useDisconnect } from '@wallet-standard/react';
import { Portal } from '@zag-js/react';
import React from 'react';

import { useSolanaWalletUi } from './solana-wallet-ui-context';

export function SolanaWalletUiDialog({ description, title }: { description?: string; title?: string }) {
    const { dialogApi: api, connected, disconnect } = useSolanaWalletUi();

    if (!api) {
        console.log('no api');
        return null;
    }

    if (!api.open) {
        console.log('no api.open');
        return null;
    }

    return (
        <Portal>
            <div className="dialog" {...api.getBackdropProps()} />
            <div className="dialog" {...api.getPositionerProps()}>
                <div className="dialog" {...api.getContentProps()}>
                    {title ? (
                        <h2 className="dialog" {...api.getTitleProps()}>
                            {title}
                        </h2>
                    ) : null}
                    {description ? (
                        <p className="dialog" {...api.getDescriptionProps()}>
                            {description}
                        </p>
                    ) : null}
                    <div style={{ marginTop: '32px' }}>
                        <SolanaWalletUiDialogList />
                        {connected ? <button onClick={disconnect}>Disconnect</button> : null}
                    </div>
                    <button className="dialog" {...api.getCloseTriggerProps()}>
                        &times;
                    </button>
                </div>
            </div>
        </Portal>
    );
}

export function SolanaWalletUiDialogList() {
    const { wallets } = useSolanaWalletUi();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {wallets.map((item, index) => (
                <SolanaWalletUiDialogListItem key={`${item.name}-${index}`} wallet={item} />
            ))}
        </div>
    );
}

export function SolanaWalletUiDialogListItem({ wallet }: { wallet: UiWallet }) {
    const [isConnecting, connect] = useConnect(wallet);
    const [isDisconnecting, disconnect] = useDisconnect(wallet);
    const { connectAccount, walletAccount } = useSolanaWalletUi();
    const accounts = wallet.accounts ?? [];
    const isConnected = wallet.accounts.length > 0;
    const isPending = isConnecting || isDisconnecting;

    if (isPending) {
        return <div>Pending...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ alignItems: 'center', display: 'flex', gap: '8px' }}>
                    <img src={wallet.icon} alt={wallet.name} style={{ height: 32 }} />
                    <span style={{ fontSize: '1rem', fontWeight: '500' }}>{wallet.name}</span>
                </div>
                {isConnected ? (
                    <button
                        disabled={isPending}
                        onClick={() => {
                            void disconnect();
                        }}
                    >
                        Disconnect
                    </button>
                ) : (
                    <button
                        disabled={isPending}
                        onClick={() => {
                            void connect();
                        }}
                    >
                        Connect
                    </button>
                )}
            </div>
            {accounts.map((item, index) => (
                <div key={`${item.address}-${index}`}>
                    <button
                        disabled={item.address === walletAccount?.address}
                        onClick={() => {
                            void connectAccount(wallet, item);
                        }}
                    >
                        {item.address}
                    </button>
                </div>
            ))}
        </div>
    );
}
