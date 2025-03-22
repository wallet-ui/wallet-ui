import {
    getUiWalletAccountStorageKey,
    UiWallet,
    UiWalletAccount,
    uiWalletAccountBelongsToUiWallet,
    uiWalletAccountsAreSame,
    useWallets,
} from '@wallet-standard/react';
import React, { useEffect, useMemo, useState } from 'react';

import { useWalletUiCluster } from './use-wallet-ui-cluster';
import { WalletUiAccountContext } from './wallet-ui-account-context';

const STORAGE_KEY = 'wallet-ui:selected-wallet-account';

let wasSetterInvoked = false;

function getSavedWalletAccount(wallets: readonly UiWallet[], storageKey: string): UiWalletAccount | undefined {
    if (wasSetterInvoked) {
        // After the user makes an explicit choice of wallet, stop trying to auto-select the
        // saved wallet, if and when it appears.
        return;
    }
    const savedWalletNameAndAddress = localStorage.getItem(storageKey);
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
export function WalletUiAccountContextProvider({
    children,
    storageKey = STORAGE_KEY,
}: {
    children: React.ReactNode;
    storageKey?: string;
}) {
    const { cluster } = useWalletUiCluster();
    const wallets = useWallets();
    const [account, setAccountInternal] = useState<UiWalletAccount | undefined>(() =>
        getSavedWalletAccount(wallets, storageKey),
    );

    function setAccount(setStateAction: React.SetStateAction<UiWalletAccount | undefined>) {
        console.log('setAccount', setStateAction);
        setAccountInternal(prevAccount => {
            wasSetterInvoked = true;
            const nextWalletAccount =
                typeof setStateAction === 'function' ? setStateAction(prevAccount) : setStateAction;
            const accountKey = nextWalletAccount ? getUiWalletAccountStorageKey(nextWalletAccount) : undefined;
            if (accountKey) {
                localStorage.setItem(storageKey, accountKey);
            } else {
                localStorage.removeItem(storageKey);
            }
            return nextWalletAccount;
        });
    }

    useEffect(() => {
        const savedWalletAccount = getSavedWalletAccount(wallets, storageKey);
        if (savedWalletAccount) {
            setAccountInternal(savedWalletAccount);
        }
    }, [wallets]);
    const walletAccount = useMemo(() => {
        if (account) {
            for (const uiWallet of wallets) {
                for (const uiWalletAccount of uiWallet.accounts) {
                    if (uiWalletAccountsAreSame(account, uiWalletAccount)) {
                        return uiWalletAccount;
                    }
                }
                if (uiWalletAccountBelongsToUiWallet(account, uiWallet) && uiWallet.accounts[0]) {
                    // If the selected account belongs to this connected wallet, at least, then
                    // select one of its accounts.
                    return uiWallet.accounts[0];
                }
            }
        }
    }, [account, wallets]);
    useEffect(() => {
        // If there is a selected wallet account but the wallet to which it belongs has since
        // disconnected, clear the selected wallet.
        if (account && !walletAccount) {
            setAccountInternal(undefined);
        }
    }, [account, walletAccount]);

    const wallet = useMemo(() => {
        if (!walletAccount) {
            return undefined;
        }
        for (const uiWallet of wallets) {
            for (const uiWalletAccount of uiWallet.accounts) {
                if (uiWalletAccountsAreSame(walletAccount, uiWalletAccount)) {
                    return uiWallet;
                }
            }
            if (uiWalletAccountBelongsToUiWallet(walletAccount, uiWallet) && uiWallet.accounts[0]) {
                // If the selected account belongs to this connected wallet, at least, then
                // select one of its accounts.
                return uiWallet;
            }
        }
    }, [walletAccount, wallets]);

    // Expose the error boundary reset keys to the context
    const errorBoundaryResetKeys = useMemo(() => {
        if (!account) {
            return [];
        }
        return [cluster.id, getUiWalletAccountStorageKey(account)].filter(Boolean);
    }, [account]);
    return (
        <WalletUiAccountContext.Provider
            value={useMemo(
                () => ({
                    account: walletAccount,
                    errorBoundaryResetKeys,
                    setAccount,
                    wallet,
                }),
                [walletAccount, wallet, errorBoundaryResetKeys],
            )}
        >
            {children}
        </WalletUiAccountContext.Provider>
    );
}
