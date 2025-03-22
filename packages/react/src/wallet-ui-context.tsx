import { UiWallet, UiWalletAccount } from '@wallet-standard/react';
import React, { ReactNode } from 'react';

import { WalletUiSize } from './types/wallet-ui-size';
import { BaseDropdownControl } from './use-base-dropdown';
import { BaseModalControl } from './use-base-modal';

export interface WalletUiContextProviderProps {
    children: ReactNode;
    size?: WalletUiSize;
}

export interface WalletUiProviderContextValue {
    account?: UiWalletAccount;
    change: () => void;
    connect: (wallet: UiWalletAccount) => void;
    connected: boolean;
    copy: () => void;
    disconnect: () => void;
    dropdown: BaseDropdownControl;
    modal: BaseModalControl;
    size: WalletUiSize;
    wallet?: UiWallet;
    wallets: UiWallet[];
}

export interface WalletUiContextProviderProps {
    children: ReactNode;
    size?: WalletUiSize;
}

export const WalletUiContext = React.createContext<WalletUiProviderContextValue>({} as WalletUiProviderContextValue);
