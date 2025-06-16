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
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
};
</script>

<svg 
    class={cn(sizeClasses[size], className)}
    data-wu="wallet-ui-icon-close"
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
>
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
</svg>