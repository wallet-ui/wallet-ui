import { UiWallet, UiWalletAccount } from '@wallet-standard/react';
import React, { createContext } from 'react';

export interface WalletUiAccountInfo {
    account: UiWalletAccount;
    accountKeys: string[];
    wallet: UiWallet | undefined;
}

export interface WalletUiAccountState extends Omit<WalletUiAccountInfo, 'account'> {
    account: UiWalletAccount | undefined;
    setAccount: React.Dispatch<React.SetStateAction<UiWalletAccount | undefined>>;
}

export const WalletUiAccountContext = createContext<WalletUiAccountState>({} as WalletUiAccountState);
