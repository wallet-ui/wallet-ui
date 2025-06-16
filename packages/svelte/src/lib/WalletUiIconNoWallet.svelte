<script lang="ts">
import type { WalletUiSize } from './wallet-state.svelte.js';
import { cn } from './utils.js';

interface Props {
    size?: WalletUiSize;
    class?: string;
}

let { size = 'md', class: className }: Props = $props();

const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
};
</script>

<svg 
    class={cn(sizeClasses[size], className)}
    data-wu="wallet-ui-icon-no-wallet"
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
>
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
</svg>