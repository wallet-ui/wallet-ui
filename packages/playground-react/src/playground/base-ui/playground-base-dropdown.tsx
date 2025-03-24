import {
    BaseDropdown,
    BaseDropdownItem,
    BaseDropdownItemType,
    handleCopyText,
    UiWallet,
    UiWalletAccount,
    useBaseDropdown,
    useWalletUi,
    WalletUiIcon,
    WalletUiSize,
} from '@wallet-ui/react';

import React, { useMemo, useState } from 'react';
import { ellipsify } from '../../lib/ellipsify';
import { UiGroup, UiPanel, UiSizes } from '../../ui/';

interface GetItemsConnectedOptions {
    account?: UiWalletAccount;
    handleWalletDisconnect: () => void;
}

interface GetItemsDisconnectedOptions {
    handleWalletConnect: (wallet: UiWallet) => void;
    handleWalletDisconnect: () => void;
    size?: WalletUiSize;
    wallets: UiWallet[];
}

interface GetItemsOptions extends GetItemsConnectedOptions, GetItemsDisconnectedOptions {
    isConnected: boolean;
}

function getItemsConnected({ account, handleWalletDisconnect }: GetItemsConnectedOptions): BaseDropdownItem[] {
    if (!account) {
        return [];
    }
    return [
        {
            handler: async () => handleCopyText(account.address),
            label: 'Copy Address',
            value: 'copy',
            type: BaseDropdownItemType.WalletCopy,
        },
        {
            handler: async () => handleWalletDisconnect(),
            label: 'Disconnect',
            value: 'disconnect',
            type: BaseDropdownItemType.WalletDisconnect,
        },
    ];
}

function getItemsDisconnected({
    handleWalletConnect,
    handleWalletDisconnect,
    size = 'md',
    wallets,
}: GetItemsDisconnectedOptions): BaseDropdownItem[] {
    if (!wallets.length) {
        return [
            {
                disabled: true,
                handler: async () => handleWalletDisconnect(),
                label: 'No wallets',
                type: BaseDropdownItemType.Item,
                value: 'no-wallets',
            },
        ];
    }
    return wallets.map(wallet => ({
        handler: async () => handleWalletConnect(wallet),
        label: wallet.name,
        leftSection: <WalletUiIcon wallet={wallet} size={size} />,
        value: wallet.name,
        type: BaseDropdownItemType.WalletConnect,
    }));
}

function getItems({
    account,
    handleWalletConnect,
    handleWalletDisconnect,
    isConnected,
    wallets,
    size,
}: GetItemsOptions): BaseDropdownItem[] {
    if (isConnected) {
        return getItemsConnected({ account, handleWalletDisconnect });
    }
    return getItemsDisconnected({ handleWalletConnect, handleWalletDisconnect, wallets, size });
}

function useTestWalletDropdownItems({
    account,
    buttonSize = 'md',
    itemSize = 'md',
    wallets = [],
}: {
    account?: UiWalletAccount;
    buttonSize?: WalletUiSize;
    itemSize?: WalletUiSize;
    wallets: UiWallet[];
}) {
    const { selectedWallet, setSelectedWallet } = useTestWalletAccount();
    const [isConnected, setIsConnected] = useState(false);

    function handleWalletDisconnect() {
        setSelectedWallet(undefined);
        setIsConnected(false);
    }

    function handleWalletConnect(wallet: UiWallet) {
        setSelectedWallet(wallet);
        setIsConnected(true);
    }

    const items = useMemo(
        () =>
            getItems({
                account,
                handleWalletConnect,
                handleWalletDisconnect,
                size: itemSize,
                isConnected,
                wallets,
            }),
        [account, handleWalletConnect, handleWalletDisconnect, itemSize, isConnected, selectedWallet, wallets],
    );

    const buttonLabel = isConnected
        ? ((account?.address ? ellipsify(account.address) : selectedWallet?.name) ?? 'Connected')
        : 'Select Wallet';
    const buttonLeftSection = selectedWallet ? <WalletUiIcon wallet={selectedWallet} size={buttonSize} /> : undefined;

    return {
        buttonLabel,
        buttonLeftSection,
        isConnected,
        items,
        selectedWallet,
        setSelectedWallet,
    };
}

function useTestWalletAccount() {
    const { wallets } = useWalletUi();
    const [selectedWallet, setSelectedWallet] = useState<UiWallet | undefined>(undefined);

    const account: UiWalletAccount | undefined = useMemo(() => {
        if (!selectedWallet || !selectedWallet.accounts.length) {
            return undefined;
        }
        return selectedWallet.accounts[0];
    }, [selectedWallet]);

    return {
        account,
        selectedWallet,
        setSelectedWallet,
        wallets,
    };
}

export function PlaygroundBaseDropdown() {
    return (
        <UiGroup style={{ alignItems: 'flex-start' }}>
            <UiSizes render={size => <TestReactPanelBaseDropdownItem key={size} size={size} />} />
        </UiGroup>
    );
}

function TestReactPanelBaseDropdownItem({ size }: { size: WalletUiSize }) {
    const { account, wallets } = useTestWalletAccount();
    const { items, buttonLabel, buttonLeftSection } = useTestWalletDropdownItems({
        account,
        buttonSize: size,
        itemSize: size,
        wallets,
    });
    const dropdown = useBaseDropdown();

    return (
        <UiPanel key={size} title={<code>{size}</code>}>
            <BaseDropdown
                dropdown={dropdown}
                buttonProps={{ label: buttonLabel, leftSection: buttonLeftSection, size }}
                items={items}
            />
        </UiPanel>
    );
}
