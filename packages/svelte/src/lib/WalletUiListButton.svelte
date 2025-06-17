<script lang="ts">
import type { UiWallet, UiWalletAccount } from 'wallet-standard-svelte';
import type { WalletUiSize } from './wallet-state.svelte.js';
import WalletUiIcon from './WalletUiIcon.svelte';
import WalletUiLabel from './WalletUiLabel.svelte';
import { useWalletUi } from './use-wallet-ui.js';

interface Props {
    wallet: UiWallet;
    size?: WalletUiSize;
    class?: string;
    select?: (account: UiWalletAccount) => Promise<void>;
}

let { wallet, size = 'md', class: className, select }: Props = $props();

const walletUi = useWalletUi();

let pending = $state(false);

// Use both local pending state and global connecting state
let isConnecting = $derived(pending || walletUi.connecting);

async function handleSelect() {
    if (isConnecting) return;
    
    // Clear any previous errors
    walletUi.clearError();
    
    pending = true;
    try {
        if (select) {
            // If wallet already has accounts, use the first one
            if (wallet.accounts.length > 0) {
                await select(wallet.accounts[0]);
            } else {
                // Connect wallet first to get accounts, then call select with the account
                await walletUi.connect(wallet);
                // After connection, the wallet state should have the account
                if (walletUi.account) {
                    await select(walletUi.account);
                }
            }
        } else {
            // No select handler, just connect the wallet directly
            await walletUi.connect(wallet);
        }
    } catch (error) {
        console.error('Failed to select wallet:', error);
    } finally {
        pending = false;
    }
}
</script>

<button
    disabled={isConnecting}
    data-wu="wallet-ui-list-button"
    class="{size} {isConnecting ? 'pending' : ''} {className ?? ''}"
    onclick={handleSelect}
>
    <WalletUiIcon {wallet} {size} />
    <WalletUiLabel {wallet} {size} />
    {#if isConnecting}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"></circle>
            <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    {/if}
</button>