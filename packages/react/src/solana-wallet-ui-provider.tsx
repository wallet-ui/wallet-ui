import { UiWallet, UiWalletAccount, useWallets } from '@wallet-standard/react';
import * as dialog from '@zag-js/dialog';
import * as menu from '@zag-js/menu';
import { normalizeProps, useMachine } from '@zag-js/react';
import React, { ReactNode, useId, useMemo, useState } from 'react';

import { useSolanaWallet } from './solana-wallet-context';
import { SolanaWalletUiContext, SolanaWalletUiProviderContext } from './solana-wallet-ui-context';

export function SolanaWalletUiProvider(props: { children: ReactNode }) {
    const [wallet, setWallet] = useState<UiWallet | undefined>(undefined);
    const wallets = useWallets();
    const [walletAccount, setWalletAccount] = useSolanaWallet();
    const dialogService = useMachine(dialog.machine, { id: useId(), modal: true });
    const dialogApi = dialog.connect(dialogService, normalizeProps);
    const menuService = useMachine(menu.machine, { id: useId() });
    const menuApi = menu.connect(menuService, normalizeProps);

    const [connected, setConnected] = useState(false);

    function change() {
        menuService.send({ type: 'CLOSE' });
        dialogService.send({ type: 'OPEN' });
    }

    function connectAccount(wallet: UiWallet | undefined, account: UiWalletAccount | undefined) {
        console.log('connectAccount', account);
        setWalletAccount(account);
        setWallet(wallet);
        setConnected(true);
        dialogService.send({ type: 'CLOSE' });
    }

    async function copy() {
        if (!walletAccount) {
            return;
        }
        await navigator.clipboard.writeText(walletAccount.address);
        menuService.send({ type: 'CLOSE' });
        dialogService.send({ type: 'CLOSE' });
    }

    function disconnect() {
        setConnected(false);
        setWalletAccount(undefined);
        // dialogService.send({ type: 'CLOSE' });
        // menuService.send({ type: 'CLOSE' });
    }

    const value: SolanaWalletUiProviderContext = {
        change,
        connectAccount,
        connected: connected && walletAccount !== undefined,
        copy,
        dialogApi,
        disconnect,
        menuApi,
        wallet,
        walletAccount,
        wallets: useMemo(() => wallets.filter(wallet => wallet.chains.some(i => i.startsWith('solana:'))), [wallets]),
    };

    return <SolanaWalletUiContext.Provider value={value}>{props.children}</SolanaWalletUiContext.Provider>;
}
