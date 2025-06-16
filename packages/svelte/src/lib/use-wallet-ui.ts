import { getContext } from 'svelte';
import type { WalletState } from './wallet-state.svelte.js';

export function useWalletUi(): WalletState {
    const state = getContext<WalletState>('wallet-state');
    if (!state) {
        throw new Error('useWalletUi must be used within a WalletUi component');
    }
    return state;
}