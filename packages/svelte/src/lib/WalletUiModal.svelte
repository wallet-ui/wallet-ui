<script lang="ts">
import BaseModal from './components/base-modal.svelte';
import type { UiWallet, UiWalletAccount } from 'wallet-standard-svelte';
import type { WalletUiSize } from './wallet-state.svelte.js';
import WalletUiList from './WalletUiList.svelte';

interface Props {
    wallets: UiWallet[];
    size?: WalletUiSize;
    title?: string;
    description?: string;
    select?: (account: UiWalletAccount) => Promise<void>;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

let { 
    wallets, 
    size = 'md', 
    title = "Connect Wallet",
    description = "Connect a wallet on Solana to continue",
    select,
    open = $bindable(false),
    onOpenChange
}: Props = $props();

const modalId = $props.id();

async function handleSelect(account: UiWalletAccount) {
    try {
        await select?.(account);
    } catch (error) {
        console.error('Failed to connect wallet:', error);
    }
}
</script>

<BaseModal
    id={modalId}
    {description}
    {size}
    {open}
    {onOpenChange}
>
    {#snippet children()}
        <WalletUiList {wallets} {size} select={handleSelect} />
    {/snippet}
</BaseModal>