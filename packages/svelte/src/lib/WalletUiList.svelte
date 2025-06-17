<script lang="ts">
import type { UiWallet, UiWalletAccount } from 'wallet-standard-svelte';
import type { WalletUiSize } from './wallet-state.svelte.js';
import WalletUiListButton from './WalletUiListButton.svelte';

interface Props {
    wallets: UiWallet[];
    size?: WalletUiSize;
    class?: string;
    select?: (account: UiWalletAccount) => Promise<void>;
}

let { wallets, size = 'md', class: className, select }: Props = $props();
</script>

<div 
    data-wu="wallet-ui-list"
    class="{size} {className ?? ''}"
>
    {#each wallets as wallet (wallet.name)}
        <WalletUiListButton {wallet} {size} {select} />
    {/each}
</div>