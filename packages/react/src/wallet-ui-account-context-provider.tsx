import { useStore } from '@nanostores/react';
import {
    getUiWalletAccountStorageKey,
    UiWallet,
    UiWalletAccount,
    uiWalletAccountBelongsToUiWallet,
    uiWalletAccountsAreSame,
    useWallets,
} from '@wallet-standard/react';
import { createStorageAccount, SolanaCluster, StorageAccount } from '@wallet-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { WalletUiAccountContext } from './wallet-ui-account-context';

let wasSetterInvoked = false;

function getSavedWalletAccount(
    wallets: readonly UiWallet[],
    savedWalletNameAndAddress?: string,
): UiWalletAccount | undefined {
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
    const wallet = wallets.find(w => w.name === savedWalletName);
    if (!wallet) {
        return;
    }
    return wallet.accounts.find(a => a.address === savedAccountAddress);
}

/**
 * Saves the selected wallet account's storage key to the browser's local storage. In future
 * sessions it will try to return that same wallet account, or at least one from the same brand of
 * wallet if the wallet from which it came is still in the Wallet Standard registry.
 */
export function WalletUiAccountContextProvider({
    children,
    cluster,
    storage = createStorageAccount(),
}: {
    children: React.ReactNode;
    cluster: SolanaCluster;
    storage?: StorageAccount;
}) {
    const wallets = useWallets();
    const accountId = useStore(storage.value);
    const [account, setAccountInternal] = useState<UiWalletAccount | undefined>(() =>
        getSavedWalletAccount(wallets, accountId),
    );

    const setAccount = useCallback(
        (setStateAction: React.SetStateAction<UiWalletAccount | undefined>) => {
            setAccountInternal(prevAccount => {
                wasSetterInvoked = true;
                const nextWalletAccount =
                    typeof setStateAction === 'function' ? setStateAction(prevAccount) : setStateAction;
                const accountKey = nextWalletAccount ? getUiWalletAccountStorageKey(nextWalletAccount) : undefined;
                storage.set(accountKey ? accountKey : undefined);
                return nextWalletAccount;
            });
        },
        [storage],
    );

    useEffect(() => {
        const savedWalletAccount = getSavedWalletAccount(wallets, accountId);
        if (savedWalletAccount) {
            setAccountInternal(savedWalletAccount);
        }
    }, [accountId, wallets]);
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
    const accountKeys = useMemo(() => {
        if (!walletAccount) {
            return [];
        }
        return [cluster.id, getUiWalletAccountStorageKey(walletAccount)].filter(Boolean);
    }, [walletAccount, cluster.id]);

    return (
        <WalletUiAccountContext.Provider
            value={useMemo(
                () => ({
                    account: walletAccount,
                    accountKeys,
                    cluster,
                    setAccount,
                    wallet,
                }),
                [accountKeys, cluster, setAccount, wallet, walletAccount],
            )}
        >
            {children}
        </WalletUiAccountContext.Provider>
    );
}
