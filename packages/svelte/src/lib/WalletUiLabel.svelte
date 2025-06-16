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
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
};
</script>

<span 
    class={cn("font-medium", sizeClasses[size], className)}
    data-wu="wallet-ui-label"
>
    {wallet.name}
</span>