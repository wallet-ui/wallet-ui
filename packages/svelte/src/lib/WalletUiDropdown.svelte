<script lang="ts">
import BaseDropdown from './components/base-dropdown.svelte';
import { useWalletUi } from './use-wallet-ui.js';
import type { WalletUiSize } from './wallet-state.svelte.js';
import type { UiWallet, UiWalletAccount } from 'wallet-standard-svelte';
import WalletUiIcon from './WalletUiIcon.svelte';

interface Props {
    size?: WalletUiSize;
    class?: string;
}

let { size, class: className }: Props = $props();

const wallet = useWalletUi();

async function connectWallet(w: UiWallet) {
    try {
        await wallet.connect(w);
    } catch (error) {
        console.error('Failed to connect:', error);
    }
}

async function switchAccount(account: UiWalletAccount) {
    try {
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

// Transform wallet data into dropdown items
const dropdownItems = $derived(() => {
    const items: any[] = [];
    
    if (wallet.connected) {
        // Copy address item
        items.push({
            type: 'item',
            value: 'copy-address',
            label: 'Copy Address',
            handler: wallet.copy,
            disabled: false
        });
        
        // Account switching items
        if (wallet.wallet && wallet.wallet.accounts.length > 1) {
            wallet.wallet.accounts.forEach((account: UiWalletAccount) => {
                items.push({
                    type: 'item',
                    value: `account-${account.address}`,
                    label: `${account.address.slice(0, 8)}...${account.address.slice(-8)}`,
                    handler: () => switchAccount(account),
                    disabled: account.address === wallet.account?.address,
                    showCheckmark: account.address === wallet.account?.address
                });
            });
        }
        
        // Wallet switching items
        wallet.wallets.forEach((w: UiWallet) => {
            items.push({
                type: 'item',
                value: `wallet-${w.name}`,
                label: w.name,
                handler: () => connectWallet(w),
                disabled: w.name === wallet.wallet?.name,
                wallet: w,
                showCheckmark: w.name === wallet.wallet?.name
            });
        });
        
        // Disconnect item
        items.push({
            type: 'item',
            value: 'disconnect',
            label: 'Disconnect',
            handler: handleDisconnect,
            disabled: false
        });
    } else {
        // Connect wallet items
        wallet.wallets.forEach((w: UiWallet) => {
            items.push({
                type: 'item',
                value: `connect-${w.name}`,
                label: w.name,
                handler: () => connectWallet(w),
                disabled: false,
                wallet: w
            });
        });
        
        if (wallet.wallets.length === 0) {
            items.push({
                type: 'item',
                value: 'no-wallets',
                label: 'No wallets found',
                handler: async () => {},
                disabled: true
            });
        }
    }
    
    return items;
});

function ellipsify(str = '', len = 4, delimiter = '..') {
    const strLen = str.length;
    const limit = len * 2 + delimiter.length;
    return strLen >= limit ? str.substring(0, len) + delimiter + str.substring(strLen - len, strLen) : str;
}
</script>

<div data-wu="wallet-ui-dropdown">
    <BaseDropdown 
        items={dropdownItems()} 
        {size}
        buttonProps={{class: className}}
        showIndicator={true}
    >
        {#if wallet.connected && wallet.wallet}
            <WalletUiIcon wallet={wallet.wallet} {size} />
        {/if}
        {#if wallet.connected}
            <span>{wallet.account ? ellipsify(wallet.account.address) : (wallet.wallet?.name || 'Connected')}</span>
        {:else}
            <span>Select Wallet</span>
        {/if}
    </BaseDropdown>
</div>