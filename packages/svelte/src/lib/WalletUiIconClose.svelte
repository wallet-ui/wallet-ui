<script lang="ts">
import BaseSvg from './components/base-svg.svelte';
import type { WalletUiSize } from './wallet-state.svelte.js';

interface Props {
    size?: WalletUiSize;
    class?: string;
}

let { size = 'md', class: className }: Props = $props();
</script>

<BaseSvg 
    viewBox="0 0 24 24"
    {size}
    class={className}
    data-wu="wallet-ui-icon-close"
>
    {#snippet children()}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    {/snippet}
</BaseSvg>