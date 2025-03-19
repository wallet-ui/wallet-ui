import { UiWallet, useConnect, useDisconnect } from '@wallet-standard/react';
import React from 'react';

import { useSolanaWalletUi } from './solana-wallet-ui-context';

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
