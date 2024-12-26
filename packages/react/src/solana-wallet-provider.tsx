import {
    getUiWalletAccountStorageKey,
    UiWallet,
    uiWalletAccountBelongsToUiWallet,
    uiWalletAccountsAreSame,
    useWallets,
} from '@wallet-standard/react';
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useState } from 'react';

import { SelectedWalletAccountState, SolanaWalletContext } from './solana-wallet-context';
import { useLocalStorage } from './use-local-storage';

const STORAGE_KEY = 'placeholder:selected-wallet-and-address';

let wasSetterInvoked = false;

function getSavedWalletAccount(wallets: readonly UiWallet[], savedWalletNameAndAddress: string | null) {
    if (wasSetterInvoked) {
        // After the user makes an explicit choice of wallet, stop trying to auto-select the
        // saved wallet, if and when it appears.
        return;
    }
    if (!savedWalletNameAndAddress || typeof savedWalletNameAndAddress !== 'string') {
        return;
    }
    const [savedWalletName, savedAccountAddress] = savedWalletNameAndAddress.split(':');
    if (!savedWalletName || !savedAccountAddress) {
        return;
    }
    for (const wallet of wallets) {
        if (wallet.name === savedWalletName) {
            for (const account of wallet.accounts) {
                if (account.address === savedAccountAddress) {
                    return account;
                }
            }
        }
    }
}

/**
 * Saves the selected wallet account's storage key to the browser's local storage. In future
 * sessions it will try to return that same wallet account, or at least one from the same brand of
 * wallet if the wallet from which it came is still in the Wallet Standard registry.
 */
export function SolanaWalletProvider({ children }: { children: ReactNode }) {
    const [storedKey, setStoredKey] = useLocalStorage<string | null>(STORAGE_KEY, null);
    const wallets = useWallets();
    const [selectedWalletAccount, setSelectedWalletAccountInternal] = useState<SelectedWalletAccountState>(() =>
        getSavedWalletAccount(wallets, storedKey),
    );
    const setSelectedWalletAccount: Dispatch<SetStateAction<SelectedWalletAccountState>> = setStateAction => {
        setSelectedWalletAccountInternal(prevSelectedWalletAccount => {
            wasSetterInvoked = true;
            const nextWalletAccount =
                typeof setStateAction === 'function' ? setStateAction(prevSelectedWalletAccount) : setStateAction;
            const accountKey = nextWalletAccount ? getUiWalletAccountStorageKey(nextWalletAccount) : undefined;
            if (accountKey) {
                setStoredKey(accountKey);
            } else {
                setStoredKey(null);
            }
            return nextWalletAccount;
        });
    };
    useEffect(() => {
        const savedWalletAccount = getSavedWalletAccount(wallets, storedKey);
        if (savedWalletAccount) {
            setSelectedWalletAccountInternal(savedWalletAccount);
        }
    }, [wallets]);
    const walletAccount = useMemo(() => {
        if (selectedWalletAccount) {
            for (const uiWallet of wallets) {
                for (const uiWalletAccount of uiWallet.accounts) {
                    if (uiWalletAccountsAreSame(selectedWalletAccount, uiWalletAccount)) {
                        return uiWalletAccount;
                    }
                }
                if (uiWalletAccountBelongsToUiWallet(selectedWalletAccount, uiWallet) && uiWallet.accounts[0]) {
                    // If the selected account belongs to this connected wallet, at least, then
                    // select one of its accounts.
                    return uiWallet.accounts[0];
                }
            }
        }
    }, [selectedWalletAccount, wallets]);
    useEffect(() => {
        // If there is a selected wallet account but the wallet to which it belongs has since
        // disconnected, clear the selected wallet.
        if (selectedWalletAccount && !walletAccount) {
            setSelectedWalletAccountInternal(undefined);
        }
    }, [selectedWalletAccount, walletAccount]);
    return (
        <SolanaWalletContext.Provider value={useMemo(() => [walletAccount, setSelectedWalletAccount], [walletAccount])}>
            {children}
        </SolanaWalletContext.Provider>
    );
}
