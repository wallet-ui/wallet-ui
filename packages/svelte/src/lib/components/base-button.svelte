<script lang="ts">
import type { WalletUiSize } from '../wallet-state.svelte.js';
import type { Snippet } from 'svelte';

interface Props {
    size?: WalletUiSize;
    leftSection?: Snippet;
    rightSection?: Snippet;
    label?: string;
    disabled?: boolean;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
    class?: string;
    [key: string]: string | number | boolean | Snippet | ((event: MouseEvent) => void) | undefined;
}

let { 
    size = 'md', 
    leftSection, 
    rightSection, 
    label, 
    disabled = false, 
    onclick,
    children,
    class: className = '',
    ...restProps 
}: Props = $props();
</script>

<button 
    data-wu="base-button" 
    class="{size} {className ?? ''}"
    {disabled}
    {onclick}
    {...restProps}
>
    {#if leftSection}
        <span data-wu="base-button-left-section">{@render leftSection()}</span>
    {/if}
    {#if label}
        {label}
    {:else if children}
        {@render children()}
    {/if}
    {#if rightSection}
        <span data-wu="base-button-right-section">{@render rightSection()}</span>
    {/if}
</button>