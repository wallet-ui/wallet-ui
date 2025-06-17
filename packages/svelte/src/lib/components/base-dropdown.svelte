<script lang="ts">
import * as menu from "@zag-js/menu"
import { portal, useMachine, normalizeProps } from "@zag-js/svelte"
import type { WalletUiSize } from '../wallet-state.svelte.js';
import type { UiWallet } from 'wallet-standard-svelte';
import type { Snippet } from 'svelte';
import WalletUiIcon from '../WalletUiIcon.svelte';

interface BaseDropdownItem {
    closeMenu?: boolean;
    disabled?: boolean;
    handler: () => Promise<void>;
    label: string;
    leftSection?: Snippet;
    rightSection?: Snippet;
    type: string;
    value: string;
    wallet?: UiWallet;
    showCheckmark?: boolean;
}

interface Props {
    buttonProps?: Record<string, string | number | boolean>;
    items: BaseDropdownItem[];
    showIndicator?: boolean;
    size?: WalletUiSize;
    children?: Snippet;
}

let { buttonProps = {}, items, showIndicator = true, size = 'md', children }: Props = $props();

const uid = $props.id();

const service = useMachine(menu.machine, { id: uid })
const api = $derived(menu.connect(service, normalizeProps))

function handleItemClick(item: BaseDropdownItem) {
    if (item.disabled) return;
    
    item.handler().then(() => {
        if (item.closeMenu !== false) {
            service.send({ type: 'CLOSE' });
        }
    });
}
</script>

<div data-wu="base-dropdown">
    <button {...api.getTriggerProps()} {...buttonProps} data-wu="base-button" class="{size} {buttonProps?.class ?? ''}">
        {@render children?.()}
        {#if showIndicator}
            <span {...api.getIndicatorProps()}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </span>
        {/if}
    </button>
    
    <div use:portal {...api.getPositionerProps()} data-wu="base-dropdown-wrapper">
        <div {...api.getContentProps()} data-wu="base-dropdown-list" data-part="content">
            {#each items as item}
                <button 
                    {...api.getItemProps({ value: item.value })}
                    data-wu="base-dropdown-item" 
                    class={size}
                    data-part="item"
                    onclick={() => handleItemClick(item)}
                    disabled={item.disabled}
                >
                    {#if item.wallet}
                        <span data-wu="base-dropdown-item-left-section">
                            <WalletUiIcon wallet={item.wallet} {size} />
                        </span>
                    {/if}
                    {#if item.leftSection}
                        <span data-wu="base-dropdown-item-left-section">{@render item.leftSection()}</span>
                    {/if}
                    {item.label}
                    {#if item.rightSection}
                        <span data-wu="base-dropdown-item-right-section">{@render item.rightSection()}</span>
                    {:else if item.showCheckmark}
                        <span data-wu="base-dropdown-item-right-section">✓</span>
                    {/if}
                </button>
            {/each}
        </div>
    </div>
</div>