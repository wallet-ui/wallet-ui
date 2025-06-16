<script lang="ts">
import * as Dialog from './components/ui/dialog/index.js';
import type { UiWallet, UiWalletAccount } from 'wallet-standard-svelte';
import type { WalletUiSize } from './wallet-state.svelte.js';
import WalletUiList from './WalletUiList.svelte';

interface Props {
    wallets: UiWallet[];
    size?: WalletUiSize;
    title?: string;
    description?: string;
    select?: (account: UiWalletAccount) => Promise<void>;
}

let { 
    wallets, 
    size = 'md', 
    title = "Connect Wallet",
    description = "Connect a wallet on Solana to continue",
    select
}: Props = $props();

async function handleSelect(account: UiWalletAccount) {
    try {
        await select?.(account);
    } catch (error) {
        console.error('Failed to connect wallet:', error);
    }
}
</script>

<Dialog.Content class="w-full max-w-sm" data-wu="wallet-ui-modal" data-scope="dialog" data-part="content">
    <Dialog.Header>
        <Dialog.Title class="text-xl font-semibold">
            {title}
        </Dialog.Title>
        {#if description}
            <Dialog.Description class="text-sm">
                {description}
            </Dialog.Description>
        {/if}
    </Dialog.Header>
    
    <WalletUiList {wallets} {size} select={handleSelect} />
</Dialog.Content>