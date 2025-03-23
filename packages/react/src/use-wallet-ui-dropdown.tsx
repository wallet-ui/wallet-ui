import { UiWallet, UiWalletAccount } from '@wallet-standard/react';
import React, { useMemo } from 'react';

import { BaseButtonProps } from './base-button';
import { BaseDropdownItem, BaseDropdownItemType } from './base-dropdown';
import { WalletUiSize } from './types/wallet-ui-size';
import { BaseDropdownControl, useBaseDropdown } from './use-base-dropdown';
import { useWalletUi } from './use-wallet-ui';
import { WalletUiIcon } from './wallet-ui-icon';

function getDropdownItemsWallets({
    wallets,
    connect,
    size,
}: {
    connect: (wallet: UiWalletAccount) => void;
    size: WalletUiSize;
    wallets: UiWallet[];
}): BaseDropdownItem[] {
    return wallets.length
        ? wallets.map(wallet => ({
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
              leftSection: <WalletUiIcon wallet={wallet} size={size} />,
              type: BaseDropdownItemType.WalletConnect,
              value: wallet.name,
              wallet,
          }))
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

export function useWalletUiDropdown({ size = 'md' }: { size?: WalletUiSize } = {}): {
    buttonProps: BaseButtonProps;
    connected: boolean;
    dropdown: BaseDropdownControl;
    items: BaseDropdownItem[];
} {
    const dropdown = useBaseDropdown();

    const { account, connect, copy, disconnect, connected, wallet, wallets } = useWalletUi();

    const itemsWallets = useMemo(() => {
        return getDropdownItemsWallets({ connect, size, wallets });
    }, [wallets, size, connect]);

    const itemsConnected: BaseDropdownItem[] = useMemo(
        () => [
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
                type: BaseDropdownItemType.WalletDisconnect,
                value: 'disconnect',
            },
            ...itemsWallets,
        ],
        [connect, copy, disconnect, dropdown, size, wallets],
    );
    const items = useMemo(() => {
        return connected ? itemsConnected : itemsWallets;
    }, [connected, itemsConnected, itemsWallets]);

    const buttonProps: BaseButtonProps = useMemo(() => {
        return {
            label: connected ? ((account ? ellipsify(account.address) : wallet?.name) ?? 'Connected') : 'Select Wallet',
            leftSection: connected ? <WalletUiIcon size={size} wallet={wallet} /> : undefined,
        };
    }, [account, connected, size, wallet]);

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
