<script lang="ts">
import BaseDropdown from './components/base-dropdown.svelte';
import { useWalletUi } from './use-wallet-ui.js';
import type { WalletUiSize } from './wallet-state.svelte.js';
import type { SolanaCluster } from '@wallet-ui/core';

interface Props {
    size?: WalletUiSize;
    class?: string;
    clusters: SolanaCluster[];
}

let { size, class: className, clusters }: Props = $props();

const wallet = useWalletUi();

// Create dropdown items from clusters
const items = $derived(clusters.map(cluster => ({
    label: cluster.label,
    value: cluster.id,
    type: 'cluster',
    showCheckmark: wallet.cluster?.id === cluster.id,
    disabled: false,
    handler: async () => {
        wallet.setCluster(cluster);
    }
})));
</script>

<div data-wu="wallet-ui-cluster-dropdown">
    <BaseDropdown {items} {size} buttonProps={{ class: className || '' }}>
        {wallet.cluster?.label || 'Select Cluster'}
    </BaseDropdown>
</div>