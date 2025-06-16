<script lang="ts">
import type { UiWallet } from 'wallet-standard-svelte';
import type { WalletUiSize } from './wallet-state.svelte.js';
import { cn } from './utils.js';

interface Props {
    wallet: UiWallet;
    size?: WalletUiSize;
    class?: string;
}

let { wallet, size = 'md', class: className }: Props = $props();

const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
};
</script>

<img 
    src={wallet.icon} 
    alt={wallet.name}
    class={cn("rounded", sizeClasses[size], className)}
    data-wu="wallet-ui-icon"
/>