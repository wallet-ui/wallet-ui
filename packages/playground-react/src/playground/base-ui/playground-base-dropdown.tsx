import {
    BaseDropdown,
    BaseDropdownItem,
    BaseDropdownItemType,
    UiWallet,
    UiWalletAccount,
    useBaseDropdown,
    useWalletUi,
    WalletUiIcon,
} from '@wallet-ui/react';

import React, { useMemo, useState } from 'react';
import { ellipsify } from '../../lib/ellipsify';

interface GetItemsOptions {
    handleWalletConnect: (wallet: UiWallet) => void;
    handleWalletDisconnect: () => void;
    wallets: UiWallet[];
}

function getItems({ handleWalletConnect, handleWalletDisconnect, wallets }: GetItemsOptions): BaseDropdownItem[] {
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
        leftSection: <WalletUiIcon wallet={wallet} />,
        value: wallet.name,
        type: BaseDropdownItemType.WalletConnect,
    }));
}

function useTestWalletDropdownItems({ account, wallets = [] }: { account?: UiWalletAccount; wallets: UiWallet[] }) {
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
                handleWalletConnect,
                handleWalletDisconnect,
                wallets,
            }),
        [account, handleWalletConnect, handleWalletDisconnect, isConnected, selectedWallet, wallets],
    );

    const buttonLabel = isConnected
        ? ((account?.address ? ellipsify(account.address) : selectedWallet?.name) ?? 'Connected')
        : 'Select Wallet';
    const buttonLeftSection = selectedWallet ? <WalletUiIcon wallet={selectedWallet} /> : undefined;

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
    return <TestReactPanelBaseDropdownItem />;
}

function TestReactPanelBaseDropdownItem() {
    const { account, wallets } = useTestWalletAccount();
    const { items, buttonLabel, buttonLeftSection } = useTestWalletDropdownItems({
        account,
        wallets,
    });
    const dropdown = useBaseDropdown();

    return (
        <BaseDropdown
            dropdown={dropdown}
            buttonProps={{ label: buttonLabel, leftSection: buttonLeftSection }}
            items={items}
            showIndicator
        />
    );
}
