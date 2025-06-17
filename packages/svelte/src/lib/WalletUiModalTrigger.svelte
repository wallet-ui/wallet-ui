<script lang="ts">
import BaseButton from './components/base-button.svelte';
import type { UiWalletAccount } from 'wallet-standard-svelte';
import type { WalletUiSize } from './wallet-state.svelte.js';
import { useWalletUi } from './use-wallet-ui.js';
import WalletUiModal from './WalletUiModal.svelte';

interface Props {
    size?: WalletUiSize;
    class?: string;
    buttonLabel?: string;
    title?: string;
    description?: string;
    children?: import('svelte').Snippet;
}

let { 
    size, 
    class: className, 
    buttonLabel = "Connect Wallet",
    title,
    description,
    children
}: Props = $props();

const wallet = useWalletUi();

let open = $state(false);

async function handleSelect(account: UiWalletAccount) {
    // Find the wallet that contains this account
    const selectedWallet = wallet.wallets.find(w => w.accounts.includes(account));
    if (selectedWallet) {
        try {
            await wallet.connect(selectedWallet);
            open = false;
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    }
}

</script>

<div data-wu="wallet-ui-modal-trigger">
    <BaseButton
        {size}
        class={className}
        onclick={() => open = true}
    >
        {#if children}
            {@render children()}
        {:else}
            {buttonLabel}
        {/if}
    </BaseButton>
    
    <WalletUiModal 
        wallets={wallet.wallets}
        {size}
        {title}
        {description}
        select={handleSelect}
        bind:open
        onOpenChange={(newOpen) => open = newOpen}
    />
</div>