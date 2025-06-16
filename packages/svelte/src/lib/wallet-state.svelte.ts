import type { UiWallet, UiWalletAccount } from 'wallet-standard-svelte';
import { useWallets, UiWalletConnect, UiWalletDisconnect } from 'wallet-standard-svelte';
import { getWallets } from '@wallet-standard/app';
import { getOrCreateUiWalletForStandardWallet_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from '@wallet-standard/ui-registry';
import type { SolanaClient, SolanaClusterMoniker } from 'gill';
import { createSolanaClient } from 'gill';
import type { SolanaCluster } from '@wallet-ui/core';
import {
	createStorageAccount,
	createStorageCluster,
	type StorageAccount,
	type StorageCluster
} from './storage.svelte.js';

async function handleCopyText(text?: string) {
	if (!text) return;

	try {
		if (navigator.clipboard) {
			await navigator.clipboard.writeText(text);
		} else {
			// Fallback for older browsers - suppress the deprecation warning
			const textArea = document.createElement('textarea');
			textArea.value = text;
			document.body.appendChild(textArea);
			textArea.select();
			// @ts-ignore - execCommand is deprecated but needed for fallback
			document.execCommand('copy');
			document.body.removeChild(textArea);
		}
	} catch (error) {
		console.error('Failed to copy text:', error);
	}
}

export type WalletUiSize = 'lg' | 'md' | 'sm';

export interface WalletUiConfig {
	clusters: SolanaCluster[];
	size?: WalletUiSize;
	accountStorage?: StorageAccount;
	clusterStorage?: StorageCluster;
}

function getWalletAccountStorageKey(account: UiWalletAccount, walletName: string): string {
	return `${walletName}:${account.address}`;
}

function getSavedWalletAccount(
	wallets: UiWallet[],
	savedWalletNameAndAddress?: string
): UiWalletAccount | undefined {
	if (!savedWalletNameAndAddress || typeof savedWalletNameAndAddress !== 'string') {
		return;
	}

	const [savedWalletName, savedAccountAddress] = savedWalletNameAndAddress.split(':');
	if (!savedWalletName || !savedAccountAddress) {
		return;
	}

	const wallet = wallets.find((w) => w.name === savedWalletName);
	if (!wallet) {
		return;
	}

	return wallet.accounts.find((a) => a.address === savedAccountAddress);
}

export class WalletState {
	// Use $state.raw for wallet objects to preserve handles for wallet-standard registry
	account = $state.raw<UiWalletAccount | undefined>(undefined);
	wallet = $state.raw<UiWallet | undefined>(undefined);
	wallets = $state.raw<UiWallet[]>([]);
	cluster = $state<SolanaCluster | undefined>(undefined);
	client = $state.raw<SolanaClient | undefined>(undefined); // Keep raw - gill client needs internal structure preserved
	size = $state<WalletUiSize>('md');

	// Connection state
	connecting = $state<boolean>(false);
	error = $state<Error | null>(null);

	// Connection handlers
	private connectHandler: UiWalletConnect | undefined;
	private disconnectHandler: UiWalletDisconnect | undefined;

	private accountStorage: StorageAccount;
	private clusterStorage: StorageCluster;
	private clusters: SolanaCluster[];

	// Wallet registry listeners
	private walletRegistryDisposers: (() => void)[] = [];

	// Trigger for manual reactivity of raw state
	private stateTrigger = $state(0);

	// Derived state with manual trigger for raw state reactivity
	connected = $derived.by(() => {
		this.stateTrigger; // Access trigger to make reactive
		return Boolean(this.wallet && this.account);
	});
	accountKeys = $derived.by(() => {
		this.stateTrigger; // Access trigger to make reactive
		return this.account && this.wallet
			? [this.cluster?.id, getWalletAccountStorageKey(this.account, this.wallet.name)].filter(
					Boolean
				)
			: [];
	});

	constructor(config: WalletUiConfig) {
		this.clusters = config.clusters;
		this.accountStorage = config.accountStorage ?? createStorageAccount();
		this.clusterStorage = config.clusterStorage ?? createStorageCluster();

		this.loadWallets(); // This will call tryRestoreAccount() at the end
		this.setupWalletRegistryListeners(); // Listen for new wallets
		this.loadSavedCluster();
		this.loadSavedAccount(); // Also call it directly to ensure it runs
		this.createClient();
	}

	private loadWallets = () => {
		// Get wallets directly from registry to ensure fresh state
		const { get } = getWallets();
		const rawWallets = get();

		// Convert to UiWallets using the official registry function
		const allWallets = rawWallets.map(
			getOrCreateUiWalletForStandardWallet_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
		);

		console.log('All detected wallets:', allWallets);

		const solanaWallets = allWallets
			.filter((wallet: UiWallet) =>
				wallet.chains.some((chain: string) => chain.startsWith('solana:'))
			)
			.sort((a: UiWallet, b: UiWallet) => a.name.localeCompare(b.name));

		console.log('Solana wallets:', solanaWallets);
		this.wallets = solanaWallets;
		this.stateTrigger++; // Trigger reactivity

		this.tryRestoreAccount();
	};

	private setupWalletRegistryListeners = () => {
		const { on } = getWallets();

		// Listen for wallet registration/unregistration
		this.walletRegistryDisposers.push(
			on('register', () => {
				console.log('New wallet registered, reloading wallet list');
				this.loadWallets();
			}),
			on('unregister', () => {
				console.log('Wallet unregistered, reloading wallet list');
				this.loadWallets();
			})
		);
	};

	private loadSavedCluster = () => {
		const savedClusterId = this.clusterStorage.current;
		if (savedClusterId) {
			const cluster = this.clusters.find((c) => c.id === savedClusterId);
			if (cluster) {
				this.cluster = cluster;
				return;
			}
		}

		// Default to first cluster
		if (this.clusters.length > 0) {
			this.cluster = this.clusters[0];
		}
	};

	private loadSavedAccount = () => {
		this.tryRestoreAccount();
	};

	private tryRestoreAccount = () => {
		const savedAccountKey = this.accountStorage.current;
		if (!savedAccountKey) return;

		// Extract wallet name from saved account key for fallback matching
		const [savedWalletName] = savedAccountKey.split(':');

		const savedAccount = getSavedWalletAccount(this.wallets, savedAccountKey);
		if (savedAccount) {
			// Find the current wallet that contains this account (exact match)
			for (const wallet of this.wallets) {
				for (const account of wallet.accounts) {
					if (account.address === savedAccount.address) {
						console.log('Restoring cached connection:', wallet.name, account.address);
						this.wallet = wallet;
						this.account = account;
						this.stateTrigger++; // Trigger reactivity
						return;
					}
				}
				// Fallback: if saved account belongs to this wallet but exact account not found,
				// use the first account from this wallet (like React version)
				if (wallet.name === savedWalletName && wallet.accounts.length > 0) {
					console.log(
						'Using first account from same wallet:',
						wallet.name,
						wallet.accounts[0].address
					);
					this.wallet = wallet;
					this.account = wallet.accounts[0];
					this.stateTrigger++; // Trigger reactivity
					return;
				}
			}
		}

		// If we get here, saved account not found - clear cache
		console.log('Saved account not found, clearing cache');
		this.accountStorage.current = undefined;
	};

	private createClient = () => {
		if (this.cluster) {
			try {
				this.client = createSolanaClient({ urlOrMoniker: this.cluster.urlOrMoniker });
			} catch (error) {
				console.error('Error creating client:', error);
			}
		}
	};

	connect = async (wallet: UiWallet) => {
		// Prevent multiple simultaneous connections
		if (this.connecting) {
			return;
		}

		this.connecting = true;
		this.error = null;

		try {
			// Create connection handler
			this.connectHandler = new UiWalletConnect(wallet);
			const accounts = await this.connectHandler.connect();

			if (accounts.length > 0) {
				// Refresh wallets to get updated account state
				this.loadWallets();

				// Find the wallet again with fresh accounts
				const freshWallets = useWallets();
				const connectedWallet = freshWallets.find((w) => w.name === wallet.name);
				const connectedAccount = connectedWallet?.accounts.find(
					(acc) => acc.address === accounts[0].address
				);

				if (connectedWallet && connectedAccount) {
					this.wallet = connectedWallet;
					this.account = connectedAccount;
				} else {
					// Fallback to original approach
					this.wallet = wallet;
					this.account = accounts[0];
				}

				// Save to storage - use wallet name + address
				const accountKey = `${wallet.name}:${accounts[0].address}`;
				this.accountStorage.current = accountKey;

				this.stateTrigger++; // Trigger reactivity
			}
		} catch (error: any) {
			console.error('Failed to connect wallet:', error);

			// Store error for UI display
			this.error = error;

			// Provide helpful console messages for common issues
			if (
				error.message?.includes('User rejected') ||
				error.message?.includes('User cancelled') ||
				error.message?.includes('rejected')
			) {
				console.warn('User cancelled wallet connection');
				// For user rejection, we can clear the error after a delay so it doesn't persist
				setTimeout(() => {
					if (this.error === error) {
						this.error = null;
					}
				}, 3000);
			} else if (
				error.message?.includes('Unexpected error') ||
				wallet.name.toLowerCase().includes('phantom')
			) {
				console.error(
					'Hint: This usually means the wallet needs to be set up. Please complete wallet onboarding first.'
				);
			}

			// Don't re-throw the error - let the UI handle it via the error state
		} finally {
			this.connecting = false;
		}
	};

	disconnect = async () => {
		try {
			if (this.wallet) {
				// Create disconnect handler
				this.disconnectHandler = new UiWalletDisconnect(this.wallet);
				await this.disconnectHandler.disconnect();
			}
		} catch (error) {
			console.error('Failed to disconnect wallet:', error);
		} finally {
			this.account = undefined;
			this.wallet = undefined;
			this.accountStorage.current = undefined;
			this.stateTrigger++; // Trigger reactivity
		}
	};

	switchAccount = async (account: UiWalletAccount) => {
		if (!this.wallet) return;

		// Switch to a different account within the same wallet
		this.account = account;

		// Update storage with new account
		const accountKey = `${this.wallet.name}:${account.address}`;
		this.accountStorage.current = accountKey;

		this.stateTrigger++; // Trigger reactivity
	};

	copy = async () => {
		if (!this.account) return;
		await handleCopyText(this.account.address);
	};

	setCluster = (cluster: SolanaCluster) => {
		this.cluster = cluster;
		this.clusterStorage.current = cluster.id;
		this.createClient();
	};

	setSize = (size: WalletUiSize) => {
		this.size = size;
	};

	clearError = () => {
		this.error = null;
	};

	destroy = () => {
		// Clean up wallet registry listeners
		this.walletRegistryDisposers.forEach((dispose) => dispose());
		this.walletRegistryDisposers = [];
	};
}

let walletState: WalletState | undefined;

export function createWalletState(config: WalletUiConfig): WalletState {
	if (!walletState) {
		walletState = new WalletState(config);
		walletState.setSize(config.size ?? 'md');
	}
	return walletState;
}

export function getWalletState(): WalletState {
	if (!walletState) {
		throw new Error('Wallet state not initialized. Call createWalletState first.');
	}
	return walletState;
}

export function destroyWalletState(): void {
	if (walletState) {
		walletState.destroy();
		walletState = undefined;
	}
}
