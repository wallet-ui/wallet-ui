import { UiWallet, UiWalletAccount } from '@wallet-standard/react';
import { SolanaClient } from 'gill';
import React, { ReactNode } from 'react';

import { WalletUiSize } from './types/wallet-ui-size';

export interface WalletUiContextProviderProps {
    children: ReactNode;
    size?: WalletUiSize;
}

export interface WalletUiProviderContextValue {
    account?: UiWalletAccount;
    client: SolanaClient;
    connect: (wallet: UiWalletAccount) => void;
    connected: boolean;
    copy: () => void;
    disconnect: () => void;
    size: WalletUiSize;
    wallet?: UiWallet;
    wallets: UiWallet[];
}

export interface WalletUiContextProviderProps {
    children: ReactNode;
    size?: WalletUiSize;
}

export const WalletUiContext = React.createContext<WalletUiProviderContextValue>({} as WalletUiProviderContextValue);
