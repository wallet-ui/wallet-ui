import '../index.css';
import type { WalletUiConfig } from './wallet-state.svelte.js';

// Main components
export { default as WalletUi } from './WalletUi.svelte';
export { default as WalletUiButton } from './WalletUiButton.svelte';
export { default as WalletUiDropdown } from './WalletUiDropdown.svelte';
export { default as WalletUiClusterDropdown } from './WalletUiClusterDropdown.svelte';
// Modal components
export { default as WalletUiModal } from './WalletUiModal.svelte';
export { default as WalletUiModalTrigger } from './WalletUiModalTrigger.svelte';
// List components
export { default as WalletUiList } from './WalletUiList.svelte';
export { default as WalletUiListButton } from './WalletUiListButton.svelte';
// Icon components
export { default as WalletUiIcon } from './WalletUiIcon.svelte';
export { default as WalletUiIconClose } from './WalletUiIconClose.svelte';
export { default as WalletUiIconNoWallet } from './WalletUiIconNoWallet.svelte';
export { default as WalletUiLabel } from './WalletUiLabel.svelte';
// State management
export { createWalletState, getWalletState } from './wallet-state.svelte.js';
export type { WalletUiConfig, WalletUiSize } from './wallet-state.svelte.js';
export { useWalletUi } from './use-wallet-ui.js';
// Storage
export { createStorageAccount, createStorageCluster } from './storage.svelte.js';
// Configuration helper
export function createWalletUiConfig(config: WalletUiConfig): WalletUiConfig {
	return config;
}
// Re-exports from standard libraries
export * from '@solana/wallet-standard-features';
// Re-export types from wallet-standard-svelte instead
export type { UiWallet, UiWalletAccount } from 'wallet-standard-svelte';
// Re-export cluster creation functions from core
export {
	createSolanaDevnet,
	createSolanaTestnet,
	createSolanaMainnet,
	createSolanaLocalnet
} from '@wallet-ui/core';
