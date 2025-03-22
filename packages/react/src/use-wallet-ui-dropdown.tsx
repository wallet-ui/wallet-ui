import { UiWallet } from '@wallet-standard/react';
import React, { useMemo } from 'react';

import { BaseButtonProps } from './base-button';
import { BaseDropdownItem } from './base-dropdown';
import { WalletUiSize } from './types/wallet-ui-size';
import { BaseDropdownControl } from './use-base-dropdown';
import { WalletUiIcon } from './wallet-ui-icon';
import { useWalletUi } from './wallet-ui-provider';

function getDropdownItemsWallets({
    wallets,
    connect,
    size,
}: {
    connect: (wallet: UiWallet) => void;
    size: WalletUiSize;
    wallets: UiWallet[];
}): BaseDropdownItem[] {
    return wallets.map(wallet => ({
        handler: () => connect(wallet),
        label: wallet.name,
        leftSection: <WalletUiIcon wallet={wallet} size={size} />,
        value: wallet.name,
    }));
}

export function useWalletUiDropdown(): {
    buttonProps: BaseButtonProps;
    connected: boolean;
    dropdown: BaseDropdownControl;
    items: BaseDropdownItem[];
} {
    const { account, connect, copy, disconnect, connected, dropdown, size, wallet, wallets } = useWalletUi();

    const itemsDisconnected = useMemo(() => {
        return getDropdownItemsWallets({ connect, size, wallets });
    }, [wallets, size, connect]);

    const itemsConnected = useMemo(
        () => [
            {
                handler: copy,
                label: 'Copy Address',
                value: 'copy',
            },
            {
                handler: () => {
                    disconnect();
                    dropdown.close();
                },
                label: 'Disconnect',
                value: 'disconnect',
            },
        ],
        [connect, copy, disconnect, dropdown, size, wallets],
    );
    const items = useMemo(() => {
        return connected ? itemsConnected : itemsDisconnected;
    }, [connected, itemsConnected, itemsDisconnected]);

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
