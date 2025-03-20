import {
    BaseDropdown,
    BaseDropdownItem,
    handleCopyText,
    WalletUiIcon,
    WalletUiSize,
    type WalletUiWallet,
    type WalletUiWalletAccount,
} from '@wallet-ui/react';

import React, { useMemo, useState } from 'react';
import { ellipsify } from './ellipsify';
import { Group } from './group';
import { TestReactRenderSizes } from './test-react-render-sizes';
import { TestReactUiPanel } from './test-react-ui-panel';
import { useTestWallets } from './test-wallets';

interface GetItemsConnectedOptions {
    account?: WalletUiWalletAccount;
    handleWalletDisconnect: () => void;
}

interface GetItemsDisconnectedOptions {
    handleWalletConnect: (wallet: WalletUiWallet) => void;
    handleWalletDisconnect: () => void;
    size?: WalletUiSize;
    wallets: WalletUiWallet[];
}

interface GetItemsOptions extends GetItemsConnectedOptions, GetItemsDisconnectedOptions {
    isConnected: boolean;
}

function getItemsConnected({ account, handleWalletDisconnect }: GetItemsConnectedOptions): BaseDropdownItem[] {
    if (!account) {
        return [];
    }
    return [
        { handler: () => handleCopyText(account.address), label: 'Copy Address', value: 'copy' },
        { closeMenu: false, handler: () => handleWalletDisconnect(), label: 'Change Wallet', value: 'change' },
        { handler: () => handleWalletDisconnect(), label: 'Disconnect', value: 'disconnect' },
    ];
}

function getItemsDisconnected({
    handleWalletConnect,
    handleWalletDisconnect,
    size = 'md',
    wallets,
}: GetItemsDisconnectedOptions): BaseDropdownItem[] {
    if (!wallets.length) {
        return [{ disabled: true, handler: () => handleWalletDisconnect(), label: 'No wallets', value: 'no-wallets' }];
    }
    return wallets.map(wallet => ({
        handler: () => handleWalletConnect(wallet),
        label: wallet.name,
        leftSection: <WalletUiIcon wallet={wallet} size={size} />,
        value: wallet.name,
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
    account?: WalletUiWalletAccount;
    buttonSize?: WalletUiSize;
    itemSize?: WalletUiSize;
    wallets: WalletUiWallet[];
}) {
    const { selectedWallet, setSelectedWallet } = useTestWalletAccount();
    const [isConnected, setIsConnected] = useState(false);

    function handleWalletDisconnect() {
        setSelectedWallet(undefined);
        setIsConnected(false);
    }

    function handleWalletConnect(wallet: WalletUiWallet) {
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
    const wallets = useTestWallets();
    const [selectedWallet, setSelectedWallet] = useState<WalletUiWallet | undefined>(undefined);

    const account: WalletUiWalletAccount | undefined = useMemo(() => {
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

export function TestReactPanelBaseDropdown() {
    return (
        <Group style={{ alignItems: 'flex-start' }}>
            <TestReactRenderSizes render={size => <TestReactPanelBaseDropdownItem key={size} size={size} />} />
        </Group>
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

    return (
        <TestReactUiPanel key={size} title={<code>size = {size}</code>}>
            <BaseDropdown
                buttonLabel={buttonLabel}
                buttonLeftSection={buttonLeftSection}
                buttonSize={size}
                items={items}
            />
        </TestReactUiPanel>
    );
}
