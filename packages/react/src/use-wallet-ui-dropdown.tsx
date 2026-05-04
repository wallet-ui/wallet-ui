import { StandardConnect, StandardDisconnect } from '@wallet-standard/core';
import { UiWallet, UiWalletAccount } from '@wallet-standard/react';
import { getWalletFeature } from '@wallet-standard/ui';
import React, { useMemo } from 'react';

import { BaseButtonProps } from './base-button';
import { BaseDropdownItem, BaseDropdownItemType } from './base-dropdown';
import { BaseDropdownControl, useBaseDropdown } from './use-base-dropdown';
import { useWalletUi } from './use-wallet-ui';
import { WalletUiIcon } from './wallet-ui-icon';

function createWalletUnavailableItem(wallet: UiWallet): BaseDropdownItem {
    return {
        disabled: true,
        handler: async () => {
            await Promise.resolve();
        },
        label: wallet.name,
        leftSection: <WalletUiIcon wallet={wallet} />,
        rightSection: 'Unavailable',
        type: BaseDropdownItemType.Item,
        value: wallet.name,
    };
}

function getDropdownItemsWallets({
    wallets,
    connect,
}: {
    connect: (wallet: UiWalletAccount) => void;
    wallets: UiWallet[];
}): BaseDropdownItem[] {
    return wallets.length
        ? wallets.map(wallet =>
              isWalletFeatureAvailable(wallet, StandardConnect)
                  ? {
                        handler: async () => {
                            // TODO: Add support for multiple accounts, properly handle no accounts
                            const account = wallet.accounts.length > 0 ? wallet.accounts[0] : undefined;
                            if (!account) {
                                return;
                            }
                            connect(account);
                            await Promise.resolve();
                        },
                        label: wallet.name,

                        type: BaseDropdownItemType.WalletConnect,
                        value: wallet.name,
                        wallet,
                    }
                  : createWalletUnavailableItem(wallet),
          )
        : [
              {
                  handler: async () => {
                      window.open('https://solana.com/solana-wallets', '_blank');
                      await Promise.resolve();
                  },
                  label: "You'll need a wallet on Solana to continue",
                  type: BaseDropdownItemType.WalletNeeded,
                  value: 'no-wallets',
              },
          ];
}

export function useWalletUiDropdown(): {
    buttonProps: BaseButtonProps;
    connected: boolean;
    dropdown: BaseDropdownControl;
    items: BaseDropdownItem[];
} {
    const dropdown = useBaseDropdown();

    const { account, connect, copy, disconnect, connected, wallet, wallets } = useWalletUi();

    const itemsWallets = useMemo(() => getDropdownItemsWallets({ connect, wallets }), [wallets, connect]);

    const itemsConnected: BaseDropdownItem[] = useMemo(
        () => {
            const walletCanDisconnect =
                isWalletFeatureAvailable(wallet, StandardConnect) && isWalletFeatureAvailable(wallet, StandardDisconnect);

            return [
                {
                    handler: async () => {
                        copy();
                        void (await Promise.resolve());
                    },
                    label: 'Copy Address',
                    type: BaseDropdownItemType.WalletCopy,
                    value: 'copy',
                },
                {
                    handler: async () => {
                        disconnect();
                        dropdown.close();
                        await Promise.resolve();
                    },
                    label: 'Disconnect',
                    type: walletCanDisconnect ? BaseDropdownItemType.WalletDisconnect : BaseDropdownItemType.Item,
                    value: 'disconnect',
                    wallet: walletCanDisconnect ? wallet : undefined,
                },
                ...itemsWallets,
            ];
        },
        [copy, disconnect, dropdown, wallet, itemsWallets],
    );
    const items = useMemo(() => {
        return connected ? itemsConnected : itemsWallets;
    }, [connected, itemsConnected, itemsWallets]);

    const buttonProps: BaseButtonProps = useMemo(() => {
        return {
            label: connected ? ((account ? ellipsify(account.address) : wallet?.name) ?? 'Connected') : 'Select Wallet',
            leftSection: connected ? <WalletUiIcon wallet={wallet} /> : undefined,
        };
    }, [account, connected, wallet]);

    return {
        buttonProps,
        connected,
        dropdown,
        items,
    };
}

export function ellipsify(str = '', len = 4, delimiter = '..') {
    const strLen = str.length;
    const limit = len * 2 + delimiter.length;

    return strLen >= limit ? str.substring(0, len) + delimiter + str.substring(strLen - len, strLen) : str;
}

function isWalletFeatureAvailable(wallet: UiWallet | undefined, featureName: UiWallet['features'][number]) {
    if (!wallet) {
        return false;
    }
    try {
        getWalletFeature(wallet, featureName);
        return true;
    } catch {
        return false;
    }
}
