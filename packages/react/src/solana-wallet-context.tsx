import { address } from '@solana/web3.js';
import type { UiWalletAccount } from '@wallet-standard/react';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export type SelectedWalletAccountState = UiWalletAccount | undefined;

export const SolanaWalletContext = createContext<
    readonly [
        selectedWalletAccount: SelectedWalletAccountState,
        setSelectedWalletAccount: Dispatch<SetStateAction<SelectedWalletAccountState>>,
    ]
>([
    undefined /* selectedWalletAccount */,
    function setSelectedWalletAccount() {
        /* empty */
    },
]);

export function useSolanaWallet() {
    return useContext(SolanaWalletContext);
}

export function useSolanaWalletAddress() {
    const [wallet] = useSolanaWallet();
    if (!wallet?.address) {
        return null;
    }
    return address(wallet.address);
}
