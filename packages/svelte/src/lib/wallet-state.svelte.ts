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
			// @@ts-expect-error - execCommand is deprecated but needed for fallback
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
	// Reactive state - use regular $state for internal reactivity
	account = $state<UiWalletAccount | undefined>(undefined);
	private _wallet = $state<UiWallet | undefined>(undefined);
	wallets = $state<UiWallet[]>([]);
	cluster = $state<SolanaCluster | undefined>(undefined);
	private _client = $state.raw<SolanaClient | undefined>(undefined); // Use raw for complex objects
	size = $state<WalletUiSize>('md');

	// Track timeouts for cleanup
	private timeoutIds = new Set<NodeJS.Timeout>();

	constructor(config: WalletUiConfig) {
		this.clusters = config.clusters;
		this.accountStorage = config.accountStorage ?? createStorageAccount();
		this.clusterStorage = config.clusterStorage ?? createStorageCluster();

		// Auto-create client when cluster changes - effects should be in constructor for classes
		$effect(() => {
			// Read this.cluster directly to ensure dependency tracking
			const currentCluster = this.cluster;
			
			if (currentCluster) {
				try {
					// Use snapshot only for external API to avoid proxy issues
					const clusterSnapshot = $state.snapshot(currentCluster);
					this._client = createSolanaClient({ urlOrMoniker: clusterSnapshot.urlOrMoniker });
				} catch (error) {
					console.error('Error creating client:', error);
					this._client = undefined;
				}
			} else {
				this._client = undefined;
			}

			// Return teardown function to clean up client when effect re-runs or component destroys
			return () => {
				if (this._client) {
					// Gill clients don't require explicit disposal - they use RPC connections
					// that are managed by the fetch API. Clearing the reference is sufficient.
					this._client = undefined;
				}
			};
		});

		this.loadWallets(); // This will call tryRestoreAccount() at the end
		this.setupWalletRegistryListeners(); // Listen for new wallets
		this.loadSavedCluster();
		this.loadSavedAccount(); // Also call it directly to ensure it runs
		// Client creation now handled automatically by $effect
	}

	// Public getters that return clean objects (same API as React version)
	get wallet(): UiWallet | undefined {
		if (!this._wallet) return undefined;
		return this.getCleanWallet(this._wallet);
	}

	set wallet(value: UiWallet | undefined) {
		this._wallet = value;
	}

	get client(): SolanaClient | undefined {
		return this._client;
	}

	set client(value: SolanaClient | undefined) {
		this._client = value;
	}

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

	// Proper derived state without manual triggers
	connected = $derived(Boolean(this._wallet && this.account));
	accountKeys = $derived(
		this.account && this._wallet
			? [this.cluster?.id, getWalletAccountStorageKey(this.account, this._wallet.name)].filter(
					Boolean
				)
			: []
	);


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
		const savedClusterId = this.clusterStorage.get();
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
		const savedAccountKey = this.accountStorage.get();
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
					return;
				}
			}
		}

		// If we get here, saved account not found - clear cache
		console.log('Saved account not found, clearing cache');
		this.accountStorage.set(undefined);
	};


	connect = async (wallet: UiWallet) => {
		// If already connecting, terminate the existing connection first
		if (this.connecting) {
			await this.terminateConnection();
		}

		this.connecting = true;
		this.error = null;

		try {
			// Get a clean wallet from registry to avoid Svelte proxy issues
			const cleanWallet = this.getCleanWallet(wallet);
			this.connectHandler = new UiWalletConnect(cleanWallet);
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
				this.accountStorage.set(accountKey);
			}
		} catch (error: unknown) {
			console.error('Failed to connect wallet:', error);

			// Store error for UI display
			const errorObj = error instanceof Error ? error : new Error(String(error));
			this.error = errorObj;

			// Provide helpful console messages for common issues
			if (
				errorObj.message?.includes('User rejected') ||
				errorObj.message?.includes('User cancelled') ||
				errorObj.message?.includes('rejected')
			) {
				console.warn('User cancelled wallet connection');
				// For user rejection, we can clear the error after a delay so it doesn't persist
				const timeoutId = setTimeout(() => {
					if (this.error === errorObj) {
						this.error = null;
					}
					this.timeoutIds.delete(timeoutId);
				}, 3000);
				this.timeoutIds.add(timeoutId);
			} else if (
				errorObj.message?.includes('Unexpected error') ||
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
				// Get a clean wallet from registry to avoid Svelte proxy issues
				const cleanWallet = this.getCleanWallet(this.wallet);
				this.disconnectHandler = new UiWalletDisconnect(cleanWallet);
				await this.disconnectHandler.disconnect();
			}
		} catch (error) {
			console.error('Failed to disconnect wallet:', error);
		} finally {
			this.account = undefined;
			this.wallet = undefined;
			this.accountStorage.set(undefined);
		}
	};

	switchAccount = async (account: UiWalletAccount) => {
		if (!this.wallet) return;

		// Switch to a different account within the same wallet
		this.account = account;

		// Update storage with new account
		const accountKey = `${this.wallet.name}:${account.address}`;
		this.accountStorage.set(accountKey);
	};

	copy = async () => {
		if (!this.account) return;
		await handleCopyText(this.account.address);
	};

	setCluster = (cluster: SolanaCluster) => {
		this.cluster = cluster;
		this.clusterStorage.set(cluster.id);
		// Client creation now handled automatically by $effect
	};

	clearError = () => {
		this.error = null;
	};


	// Helper method to get "clean" wallet from registry to avoid proxy issues
	private getCleanWallet(wallet: UiWallet): UiWallet {
		try {
			// Get the wallet name from the potentially proxied wallet
			const walletName = $state.snapshot(wallet).name;
			
			// Get a fresh wallet from the registry to avoid Svelte proxy issues
			const { get } = getWallets();
			const rawWallets = get();
			const matchingWallet = rawWallets.find(w => w.name === walletName);
			
			if (matchingWallet) {
				// Create a fresh UiWallet with proper handles
				return getOrCreateUiWalletForStandardWallet_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(matchingWallet);
			}
		} catch (error) {
			console.warn('Failed to get clean wallet from registry:', error);
		}
		
		// Fallback to the original wallet
		return wallet;
	};

	// Helper method to terminate existing connection
	private terminateConnection = async () => {
		try {
			if (this.connectHandler) {
				// Cancel any ongoing connection
				this.connectHandler = undefined;
			}
			if (this.wallet) {
				const cleanWallet = this.getCleanWallet(this.wallet);
				this.disconnectHandler = new UiWalletDisconnect(cleanWallet);
				await this.disconnectHandler.disconnect();
			}
		} catch (error) {
			console.warn('Error terminating connection:', error);
		} finally {
			this.connecting = false;
			this.connectHandler = undefined;
			this.disconnectHandler = undefined;
		}
	};

	destroy = () => {
		// Clean up all timeouts
		this.timeoutIds.forEach(id => clearTimeout(id));
		this.timeoutIds.clear();

		// Clean up wallet registry listeners
		this.walletRegistryDisposers.forEach((dispose) => dispose());
		this.walletRegistryDisposers = [];

		// Clean up connection handlers
		this.connectHandler = undefined;
		this.disconnectHandler = undefined;

		// Clear client reference
		this._client = undefined;
	};
}

let walletState: WalletState | undefined;

export function createWalletState(config: WalletUiConfig): WalletState {
	if (!walletState) {
		walletState = new WalletState(config);
		walletState.size = config.size ?? 'md'; // Direct property assignment since it's $state
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
