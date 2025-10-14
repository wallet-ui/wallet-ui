import { UiWalletAccount } from '@wallet-standard/react';
import { handleCopyText } from '@wallet-ui/core';
import React, { useMemo } from 'react';

import { useWalletUiAccount } from './use-wallet-ui-account';
import { useWalletUiWallets } from './use-wallet-ui-wallets';
import { WalletUiContext, WalletUiContextProviderProps, WalletUiContextValue } from './wallet-ui-context';

export function WalletUiContextProvider({ children }: WalletUiContextProviderProps) {
    const { account, accountKeys, cluster, setAccount, wallet } = useWalletUiAccount();
    const wallets = useWalletUiWallets();
    const connected = Boolean(wallet && wallet?.accounts.length > 0);

    const value: WalletUiContextValue = useMemo(
        () => ({
            account,
            accountKeys,
            cluster,
            connect: (account: UiWalletAccount) => setAccount(account),
            connected,
            copy: () => {
                if (!account) {
                    return;
                }
                handleCopyText(account.address);
            },
            disconnect: () => setAccount(undefined),
            wallet,
            wallets,
        }),
        [account, accountKeys, cluster, setAccount, connected, wallet, wallets],
    );

    return <WalletUiContext.Provider value={value}>{children}</WalletUiContext.Provider>;
}
