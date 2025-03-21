import { UiWallet, UiWalletAccount } from '@wallet-standard/react';
import { handleCopyText } from '@wallet-ui/core';
import React, { ReactNode, useState } from 'react';

import { useSolanaWallet } from './solana-wallet-context';
import { WalletUiSize } from './types/wallet-ui-size';
import { BaseDropdownControl, useBaseDropdown } from './use-base-dropdown';
import { BaseModalControl, useBaseModal } from './use-base-modal';
import { useWalletUiWallets } from './use-wallet-ui-wallets';
import { WalletUiModal } from './wallet-ui-modal';

export interface WalletUiProviderContext {
    account?: UiWalletAccount;
    change: () => void;
    connect: (wallet: UiWallet) => void;
    connected: boolean;
    copy: () => void;
    disconnect: () => void;
    dropdown: BaseDropdownControl;
    modal: BaseModalControl;
    size: WalletUiSize;
    wallet?: UiWallet;
    wallets: UiWallet[];
}

const WalletUiContext = React.createContext<WalletUiProviderContext>({} as WalletUiProviderContext);

export function WalletUiProvider({ children, size = 'md' }: { children: ReactNode; size: WalletUiSize }) {
    const modal = useBaseModal();
    const dropdown = useBaseDropdown();
    const [account, setWalletAccount] = useSolanaWallet();
    const [wallet, setWallet] = useState<UiWallet | undefined>(undefined);
    const wallets = useWalletUiWallets();

    async function selectWallet(wallet: UiWallet) {
        console.log('selectWallet start', wallet.name);
        await new Promise(resolve => setTimeout(resolve, 1));
        connect(wallet);
    }

    const [connected, setConnected] = useState(false);

    function change() {
        dropdown.close();
        modal.open();
    }

    function connect(wallet: UiWallet) {
        const account = wallet.accounts.length > 0 ? wallet.accounts[0] : undefined;
        console.log('connect', wallet, account);
        setWalletAccount(account);
        setWallet(wallet);
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
        setWalletAccount(undefined);
        modal.close();
        dropdown.close();
    }

    const value: WalletUiProviderContext = {
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
            <WalletUiModal modal={modal} select={selectWallet} wallets={wallets} size={size} />
        </WalletUiContext.Provider>
    );
}

export function useWalletUi() {
    return React.useContext(WalletUiContext);
}
