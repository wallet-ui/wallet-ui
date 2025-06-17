<script lang="ts">
import type { WalletUiSize } from '../wallet-state.svelte.js';

interface Props {
    size?: WalletUiSize;
    sizes?: { [key: string]: number };
    viewBox?: string;
    children?: any;
    class?: string;
    [key: string]: any;
}

let { 
    size = 'md', 
    sizes = { sm: 16, md: 20, lg: 24 }, 
    viewBox = "0 0 24 24",
    children,
    class: className = '',
    ...restProps 
}: Props = $props();

const svgSize = size ? sizes[size] : 16;
</script>

<svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={svgSize} 
    height={svgSize} 
    {viewBox}
    class="{className ?? ''}"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round" 
    stroke-linejoin="round"
    {...restProps}
>
    {@render children?.()}
</svg>