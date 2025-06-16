<script lang="ts">
import type { UiWallet, UiWalletAccount } from 'wallet-standard-svelte';
import type { WalletUiSize } from './wallet-state.svelte.js';
import WalletUiListButton from './WalletUiListButton.svelte';
import { cn } from './utils.js';

interface Props {
    wallets: UiWallet[];
    size?: WalletUiSize;
    class?: string;
    select?: (account: UiWalletAccount) => Promise<void>;
}

let { wallets, size = 'md', class: className, select }: Props = $props();

const sizeClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3'
};
</script>

<div 
    class={cn("flex flex-col", sizeClasses[size], className)}
    data-wu="wallet-ui-list"
>
    {#each wallets as wallet (wallet.name)}
        <WalletUiListButton {wallet} {size} {select} />
    {/each}
    
    {#if wallets.length === 0}
        <div class="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <svg class="mb-4 h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="mb-2 text-lg font-semibold">No wallets found</h3>
            <p class="text-sm">Please install a Solana wallet to continue.</p>
        </div>
    {/if}
</div>