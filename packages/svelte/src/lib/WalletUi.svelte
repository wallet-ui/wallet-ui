<script lang="ts">
import { setContext } from 'svelte';
import { setWalletContext } from 'wallet-standard-svelte';
import { createWalletState, type WalletUiConfig } from './wallet-state.svelte.js';

interface Props {
    config: WalletUiConfig;
    children?: import('svelte').Snippet;
}

let { config, children }: Props = $props();

// Set up wallet-standard-svelte context first
setWalletContext();

const walletState = createWalletState(config);

// Make state available to child components via context
setContext('wallet-state', walletState);
</script>

{@render children?.()}