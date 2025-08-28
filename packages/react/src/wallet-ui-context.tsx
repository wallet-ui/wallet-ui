import { UiWallet, UiWalletAccount } from '@wallet-standard/react';
import { SolanaCluster } from '@wallet-ui/core';
import React, { ReactNode } from 'react';

export interface WalletUiContextProviderProps {
    children: ReactNode;
}

export interface WalletUiContextValue {
    account?: UiWalletAccount;
    accountKeys: string[];
    cluster: SolanaCluster;
    connect: (wallet: UiWalletAccount) => void;
    connected: boolean;
    copy: () => void;
    disconnect: () => void;
    wallet?: UiWallet;
    wallets: UiWallet[];
}

export interface WalletUiContextProviderProps {
    children: ReactNode;
}

export const WalletUiContext = React.createContext<WalletUiContextValue>({} as WalletUiContextValue);
