import { UiWallet, UiWalletAccount } from '@wallet-standard/react';
import React, { createContext } from 'react';

export interface WalletUiAccountState {
    account: UiWalletAccount | undefined;
    errorBoundaryResetKeys: string[];
    setAccount: React.Dispatch<React.SetStateAction<UiWalletAccount | undefined>>;
    wallet: UiWallet | undefined;
}

export const WalletUiAccountContext = createContext<WalletUiAccountState>({} as WalletUiAccountState);
