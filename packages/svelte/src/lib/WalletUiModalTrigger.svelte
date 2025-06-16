<script lang="ts">
import * as Dialog from './components/ui/dialog/index.js';
import { Button } from './components/ui/button/index.js';
import type { UiWalletAccount } from 'wallet-standard-svelte';
import type { WalletUiSize } from './wallet-state.svelte.js';
import { useWalletUi } from './use-wallet-ui.js';
import WalletUiModal from './WalletUiModal.svelte';
import { cn } from './utils.js';

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

// Map WalletUiSize to shadcn-svelte button sizes
const sizeMap = {
    sm: 'sm' as const,
    md: 'default' as const,
    lg: 'lg' as const
};

const buttonSize = sizeMap[size || wallet.size];

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
    <Dialog.Root bind:open>
        <Dialog.Trigger>
            {#snippet child({ props })}
                <Button {...props} variant="default" size={buttonSize} class={cn(className)} data-wu="base-button">
                    {#if children}
                        {@render children()}
                    {:else}
                        {buttonLabel}
                    {/if}
                </Button>
            {/snippet}
        </Dialog.Trigger>
        
        <WalletUiModal 
            wallets={wallet.wallets}
            {size}
            {title}
            {description}
            select={handleSelect}
        />
    </Dialog.Root>
</div>