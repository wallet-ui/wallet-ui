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

    function connect(account: UiWalletAccount) {
        setAccount(account);
    }

    function disconnect() {
        setAccount(undefined);
    }

    function copy() {
        if (!account) {
            return;
        }
        handleCopyText(account.address);
    }

    const value: WalletUiProviderContextValue = {
        account,
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
