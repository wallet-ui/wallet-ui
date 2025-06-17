<script lang="ts">
import BaseButton from './components/base-button.svelte';
import BaseSvg from './components/base-svg.svelte';
import { useWalletUi } from './use-wallet-ui.js';
import type { WalletUiSize } from './wallet-state.svelte.js';

interface Props {
    size?: WalletUiSize;
    class?: string;
}

let { size, class: className }: Props = $props();

const wallet = useWalletUi();
const buttonSize = size || wallet.size;

async function handleClick() {
    if (wallet.connecting) return;
    
    if (wallet.connected) {
        wallet.copy();
    } else {
        // Clear any previous errors
        wallet.clearError();
        
        // Try to connect to first available wallet if only one exists
        if (wallet.wallets.length === 1) {
            await wallet.connect(wallet.wallets[0]);
        } else if (wallet.wallets.length > 1) {
            // If multiple wallets, user should use dropdown or modal
            console.log('Multiple wallets available. Use WalletUiDropdown or WalletUiModalTrigger for selection.');
        } else {
            console.log('No wallets detected. Please install a Solana wallet.');
        }
    }
}
</script>

<BaseButton 
    size={buttonSize}
    class={`${wallet.connecting ? "opacity-50" : ""} ${className || ""}`}
    onclick={handleClick}
    disabled={wallet.connecting}
>
    {#if wallet.connecting}
        <BaseSvg size={buttonSize} class="animate-spin mr-2" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </BaseSvg>
        Connecting...
    {:else if wallet.connected}
        {wallet.account?.address.slice(0, 4)}...{wallet.account?.address.slice(-4)}
    {:else}
        Connect Wallet
    {/if}
</BaseButton>