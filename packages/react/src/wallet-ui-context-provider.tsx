import { UiWalletAccount } from '@wallet-standard/react';
import { handleCopyText } from '@wallet-ui/core';
import React, { useState } from 'react';

import { useBaseDropdown } from './use-base-dropdown';
import { useBaseModal } from './use-base-modal';
import { useWalletUiAccount } from './use-wallet-ui-account';
import { useWalletUiWallets } from './use-wallet-ui-wallets';
import { WalletUiContext, WalletUiContextProviderProps, WalletUiProviderContextValue } from './wallet-ui-context';
import { WalletUiModal } from './wallet-ui-modal';

export function WalletUiContextProvider({ children, size = 'md' }: WalletUiContextProviderProps) {
    const modal = useBaseModal();
    const dropdown = useBaseDropdown();
    const { account: account, setAccount: setWalletAccount, wallet } = useWalletUiAccount();
    const wallets = useWalletUiWallets();

    const [connected, setConnected] = useState(false);

    function change() {
        dropdown.close();
        modal.open();
    }

    function connect(account: UiWalletAccount) {
        setWalletAccount(account);
        setConnected(true);
        modal.close();
    }

    function copy() {
        if (!account) {
            return;
        }
        handleCopyText(account.address);
        dropdown.close();
        modal.close();
    }

    function disconnect() {
        setConnected(false);
        modal.close();
        dropdown.close();
    }

    const value: WalletUiProviderContextValue = {
        account,
        change,
        connect,
        connected,
        copy,
        disconnect,
        dropdown,
        modal,
        size,
        wallet,
        wallets,
    };

    return (
        <WalletUiContext.Provider value={value}>
            {children}
            <WalletUiModal
                modal={modal}
                select={async selectedAccount => {
                    // FIX: Figure out if we need to be sync or async
                    // eslint-disable-next-line @typescript-eslint/await-thenable
                    await connect(selectedAccount);
                    return;
                }}
                wallets={wallets}
                size={size}
            />
        </WalletUiContext.Provider>
    );
}
