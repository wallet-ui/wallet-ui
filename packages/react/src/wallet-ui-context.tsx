import { UiWallet, UiWalletAccount } from '@wallet-standard/react';
import { SolanaCluster } from '@wallet-ui/core';
import { SolanaClient } from 'gill';
import React, { ReactNode } from 'react';

import { WalletUiSize } from './types/wallet-ui-size';

export interface WalletUiContextProviderProps {
    children: ReactNode;
    size?: WalletUiSize;
}

export interface WalletUiContextValue {
    account?: UiWalletAccount;
    accountKeys: string[];
    client: SolanaClient;
    cluster: SolanaCluster;
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

export const WalletUiContext = React.createContext<WalletUiContextValue>({} as WalletUiContextValue);
