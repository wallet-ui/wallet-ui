import { UiWalletAccount } from '@wallet-standard/react';
import { handleCopyText } from '@wallet-ui/core';
import React from 'react';

import { useWalletUiAccount } from './use-wallet-ui-account';
import { useWalletUiSolanaClient } from './use-wallet-ui-solana-client';
import { useWalletUiWallets } from './use-wallet-ui-wallets';
import { WalletUiContext, WalletUiContextProviderProps, WalletUiProviderContextValue } from './wallet-ui-context';

export function WalletUiContextProvider({ children, size = 'md' }: WalletUiContextProviderProps) {
    const { account, setAccount, wallet } = useWalletUiAccount();
    const wallets = useWalletUiWallets();
    const client = useWalletUiSolanaClient();
    const walletHasAccounts = Boolean(wallet && wallet?.accounts.length > 0);

    // const [connected, setConnected] = useState(!!account);

    function change() {
        console.log('change');
    }

    function connect(account: UiWalletAccount) {
        setAccount(account);
        // setConnected(true);
    }

    function copy() {
        if (!account) {
            return;
        }
        handleCopyText(account.address);
    }

    function disconnect() {
        // setConnected(false);
    }

    const value: WalletUiProviderContextValue = {
        account,
        change,
        client,
        connect,
        connected: walletHasAccounts,
        copy,
        disconnect,
        size,
        wallet,
        wallets,
    };

    return <WalletUiContext.Provider value={value}>{children}</WalletUiContext.Provider>;
}
