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
            if (!connectedAccount.length) {
                console.warn(`Connect to ${wallet.name} but there are no accounts.`);
                return connectedAccount;
            }
            // TODO: Support wallets with multiple accounts
            const first = connectedAccount[0];
            setAccount(first);
            connectAccount(first);
            return connectedAccount;
        },
        disconnect,
        isConnecting,
        isDisconnecting,
    };
}
