import { UiWallet, UiWalletAccount } from '@wallet-standard/react';
import * as dialog from '@zag-js/dialog';
import * as menu from '@zag-js/menu';
import React from 'react';

export interface SolanaWalletUiProviderContext {
    change: () => void;
    connectAccount: (wallet: UiWallet | undefined, account: UiWalletAccount | undefined) => void;
    connected: boolean;
    copy: () => Promise<void>;
    dialogApi: ReturnType<typeof dialog.connect>;
    disconnect: () => void;
    menuApi: ReturnType<typeof menu.connect>;
    wallet: UiWallet | undefined;
    walletAccount: UiWalletAccount | undefined;
    wallets: readonly UiWallet[];
}

export const SolanaWalletUiContext = React.createContext<SolanaWalletUiProviderContext>(
    {} as SolanaWalletUiProviderContext,
);

export function useSolanaWalletUi() {
    return React.useContext(SolanaWalletUiContext);
}
