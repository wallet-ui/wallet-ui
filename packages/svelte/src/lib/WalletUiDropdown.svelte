<script lang="ts">
import * as DropdownMenu from './components/ui/dropdown-menu/index.js';
import { Button } from './components/ui/button/index.js';
import { useWalletUi } from './use-wallet-ui.js';
import type { WalletUiSize } from './wallet-state.svelte.js';
import { cn } from './utils.js';

interface Props {
    size?: WalletUiSize;
    class?: string;
}

let { size, class: className }: Props = $props();

const wallet = useWalletUi();

// Map WalletUiSize to shadcn-svelte button sizes
const sizeMap = {
    sm: 'sm' as const,
    md: 'default' as const,
    lg: 'lg' as const
};

const buttonSize = sizeMap[size || wallet.size];

async function connectWallet(w: any) {
    try {
        await wallet.connect(w);
    } catch (error) {
        console.error('Failed to connect:', error);
    }
}

async function switchAccount(account: any) {
    try {
        // Switch to a different account within the same wallet
        await wallet.switchAccount(account);
    } catch (error) {
        console.error('Failed to switch account:', error);
    }
}

async function handleDisconnect() {
    try {
        await wallet.disconnect();
    } catch (error) {
        console.error('Failed to disconnect:', error);
    }
}
</script>

<div data-wu="wallet-ui-dropdown">
    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            {#snippet child({ props })}
                <Button {...props} variant="default" size={buttonSize} class={cn(className)} data-wu="base-button">
                    {#if wallet.connected}
                        <span>{wallet.wallet?.name || 'Connected'}</span>
                        <span class="ml-2">▼</span>
                    {:else}
                        <span>Select Wallet</span>
                        <span class="ml-2">▼</span>
                    {/if}
                </Button>
            {/snippet}
        </DropdownMenu.Trigger>

        <DropdownMenu.Content class="min-w-[160px]" data-wu="base-dropdown-list">
            {#if wallet.connected}
                <DropdownMenu.Item onclick={wallet.copy} data-wu="base-dropdown-item">
                    Copy Address
                </DropdownMenu.Item>
                
                {#if wallet.wallet && wallet.wallet.accounts.length > 1}
                    <DropdownMenu.Separator />
                    <DropdownMenu.Label>Switch Account</DropdownMenu.Label>
                    {#each wallet.wallet.accounts as account}
                        <DropdownMenu.Item 
                            onclick={() => switchAccount(account)} 
                            data-wu="base-dropdown-item"
                            disabled={account.address === wallet.account?.address}
                        >
                            <span class="font-mono text-sm">
                                {account.address.slice(0, 8)}...{account.address.slice(-8)}
                            </span>
                            {#if account.address === wallet.account?.address}
                                <span class="ml-auto text-xs">✓</span>
                            {/if}
                        </DropdownMenu.Item>
                    {/each}
                {/if}
                
                <DropdownMenu.Separator />
                <DropdownMenu.Label>Switch Wallet</DropdownMenu.Label>
                {#each wallet.wallets as w}
                    <DropdownMenu.Item 
                        onclick={() => connectWallet(w)} 
                        data-wu="base-dropdown-item"
                        disabled={w.name === wallet.wallet?.name}
                    >
                        <img src={w.icon} alt={w.name} class="mr-2 h-4 w-4" data-wu="wallet-ui-icon" />
                        {w.name}
                        {#if w.name === wallet.wallet?.name}
                            <span class="ml-auto text-xs">✓</span>
                        {/if}
                    </DropdownMenu.Item>
                {/each}
                <DropdownMenu.Separator />
                <DropdownMenu.Item onclick={handleDisconnect} data-wu="base-dropdown-item">
                    Disconnect
                </DropdownMenu.Item>
            {:else}
                {#each wallet.wallets as w}
                    <DropdownMenu.Item onclick={() => connectWallet(w)} data-wu="base-dropdown-item">
                        <img src={w.icon} alt={w.name} class="mr-2 h-4 w-4" data-wu="wallet-ui-icon" />
                        {w.name}
                    </DropdownMenu.Item>
                {/each}
                {#if wallet.wallets.length === 0}
                    <DropdownMenu.Item disabled data-wu="base-dropdown-item">
                        No wallets found
                    </DropdownMenu.Item>
                {/if}
            {/if}
        </DropdownMenu.Content>
    </DropdownMenu.Root>
</div>