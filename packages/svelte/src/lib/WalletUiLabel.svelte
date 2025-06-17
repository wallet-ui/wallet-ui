<script lang="ts">
import type { UiWallet } from 'wallet-standard-svelte';
import type { WalletUiSize } from './wallet-state.svelte.js';

interface Props {
    wallet?: UiWallet;
    size?: WalletUiSize;
    class?: string;
}

let { wallet, size = 'md', class: className }: Props = $props();
</script>

{#if wallet}
    <span 
        class="{size} {className ?? ''}"
        data-wu="wallet-ui-label"
    >
        {wallet.name}
    </span>
{/if}