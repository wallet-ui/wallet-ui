<script lang="ts">
	import * as dialog from '@zag-js/dialog';
	import { portal, useMachine, normalizeProps } from '@zag-js/svelte';
	import type { WalletUiSize } from '../wallet-state.svelte.js';
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		buttonLabel?: string;
		buttonProps?: Record<string, string | number | boolean>;
		children?: Snippet;
		title?: string;
		description?: string;
		size?: WalletUiSize;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
	}

	let {
		id,
		buttonLabel,
		buttonProps = {},
		size = 'md',
		title,
		description,
		children,
		open = $bindable(false),
		onOpenChange
	}: Props = $props();

	const service = useMachine(dialog.machine, {
		id,
		modal: true,
		get open() {
			return open;
		},
		onOpenChange(details) {
			open = details.open;
			onOpenChange?.(details.open);
		}
	});

	const api = $derived(dialog.connect(service, normalizeProps));
</script>

{#if buttonLabel}
	<button {...api.getTriggerProps()} data-wu="base-button" class={size} {...buttonProps}>
		{buttonLabel}
	</button>
{/if}

{#if api.open}
	<div use:portal {...api.getBackdropProps()} data-scope="dialog" data-part="backdrop"></div>
	<div use:portal {...api.getPositionerProps()} data-scope="dialog" data-part="positioner">
		<div {...api.getContentProps()} data-scope="dialog" data-part="content" class={size}>
			<header>
				<button {...api.getCloseTriggerProps()} data-scope="dialog" data-part="close-trigger">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="m18 6-12 12" />
						<path d="m6 6 12 12" />
					</svg>
				</button>
			</header>
			{#if description}
				<p {...api.getDescriptionProps()} data-scope="dialog" data-part="description">
					{description}
				</p>
			{/if}
			<main>
				{@render children?.()}
			</main>
		</div>
	</div>
{/if}
