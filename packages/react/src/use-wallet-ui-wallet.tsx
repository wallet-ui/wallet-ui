import { UiWallet, useConnect, useDisconnect } from '@wallet-standard/react';
import { useEffect } from 'react';

import { useWalletUi } from './use-wallet-ui';
import { useWalletUiAccount } from './use-wallet-ui-account';

export function useWalletUiWallet({ wallet }: { wallet: UiWallet }) {
    const { connect: connectAccount } = useWalletUi();
    const { setAccount } = useWalletUiAccount();
    const [isConnecting, connect] = useConnect(wallet);
    const [isDisconnecting, disconnect] = useDisconnect(wallet);
    useEffect(() => {}, [isDisconnecting]);

    return {
        connect: async () => {
            const connectedAccount = await connect();
            console.log('connectedAccount', connectedAccount);
            if (!connectedAccount.length) {
                console.log('connect, no accounts');
                return connectedAccount;
            }
            const first = connectedAccount[0];
            console.log('connect, setting first account => ', first);
            setAccount(first);
            connectAccount(first);
            return connectedAccount;
        },
        disconnect,
        isConnecting,
        isDisconnecting,
    };
}
