<script lang="ts">
import * as DropdownMenu from './components/ui/dropdown-menu/index.js';
import { Button } from './components/ui/button/index.js';
import { useWalletUi } from './use-wallet-ui.js';
import type { WalletUiSize } from './wallet-state.svelte.js';
import type { SolanaCluster } from '@wallet-ui/core';
import { cn } from './utils.js';

interface Props {
    size?: WalletUiSize;
    class?: string;
    clusters: SolanaCluster[];
}

let { size, class: className, clusters }: Props = $props();

const wallet = useWalletUi();

// Map WalletUiSize to shadcn-svelte button sizes
const sizeMap = {
    sm: 'sm' as const,
    md: 'default' as const,
    lg: 'lg' as const
};

const buttonSize = sizeMap[size || wallet.size];
</script>

<div data-wu="wallet-ui-cluster-dropdown">
    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            {#snippet child({ props }: { props: any })}
                <Button {...props} variant="outline" size={buttonSize} class={cn(className)} data-wu="base-button">
                    <span>{wallet.cluster?.label || 'Select Cluster'}</span>
                    <span class="ml-2">▼</span>
                </Button>
            {/snippet}
        </DropdownMenu.Trigger>

        <DropdownMenu.Content class="min-w-[160px]" data-wu="base-dropdown-list">
            {#each clusters as cluster}
                <DropdownMenu.Item 
                    onclick={() => wallet.setCluster(cluster)}
                    class={wallet.cluster?.id === cluster.id ? 'bg-accent' : ''}
                    data-wu="base-dropdown-item"
                >
                    <span class="flex items-center">
                        {#if wallet.cluster?.id === cluster.id}
                            <span class="mr-2">✓</span>
                        {:else}
                            <span class="mr-2 w-4"></span>
                        {/if}
                        {cluster.label}
                    </span>
                </DropdownMenu.Item>
            {/each}
        </DropdownMenu.Content>
    </DropdownMenu.Root>
</div>