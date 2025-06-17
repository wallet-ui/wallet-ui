import { flushSync } from 'svelte';
import { expect, test, beforeEach, vi, describe, afterEach } from 'vitest';
import { WalletState, createWalletState, getWalletState, destroyWalletState } from './wallet-state.svelte.js';

// Mock external dependencies
vi.mock('wallet-standard-svelte', () => ({
	useWallets: vi.fn(() => []),
	UiWalletConnect: vi.fn(),
	UiWalletDisconnect: vi.fn()
}));

vi.mock('@wallet-standard/app', () => ({
	getWallets: vi.fn(() => ({
		get: vi.fn(() => []),
		on: vi.fn(() => vi.fn())
	}))
}));

vi.mock('@wallet-standard/ui-registry', () => ({
	getOrCreateUiWalletForStandardWallet_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: vi.fn((wallet) => wallet)
}));

vi.mock('gill', () => ({
	createSolanaClient: vi.fn(() => ({ rpc: { getLatestBlockhash: vi.fn() } }))
}));

describe('WalletState', () => {
	const mockClusters = [
		{
			id: 'devnet',
			label: 'Devnet',
			cluster: 'devnet',
			urlOrMoniker: 'devnet'
		},
		{
			id: 'testnet', 
			label: 'Testnet',
			cluster: 'testnet',
			urlOrMoniker: 'testnet'
		}
	];

	let walletState: WalletState;

	beforeEach(() => {
		destroyWalletState();
		walletState = createWalletState({
			clusters: mockClusters,
			size: 'md'
		});
		flushSync();
	});

	afterEach(() => {
		destroyWalletState();
	});

	test('initializes with correct default values', () => {
		expect(walletState.account).toBeUndefined();
		expect(walletState.wallet).toBeUndefined();
		expect(walletState.connected).toBe(false);
		expect(walletState.connecting).toBe(false);
		expect(walletState.error).toBeNull();
		expect(walletState.size).toBe('md');
		expect(walletState.cluster).toBeDefined();
		expect(walletState.wallets).toEqual([]);
	});

	test('setCluster updates cluster and storage', () => {
		const testCluster = mockClusters[1];
		walletState.setCluster(testCluster);
		
		flushSync();
		
		expect(walletState.cluster).toEqual(testCluster);
	});

	test('copy function attempts to write to clipboard', async () => {
		const mockWriteText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, 'clipboard', {
			value: { writeText: mockWriteText },
			writable: true
		});
		
		walletState.account = { address: 'test-address' } as any;
		
		await walletState.copy();
		
		expect(mockWriteText).toHaveBeenCalledWith('test-address');
	});

	test('connected state derives from wallet and account presence', () => {
		expect(walletState.connected).toBe(false);
		
		walletState.wallet = { name: 'Test' } as any;
		walletState.account = { address: 'test' } as any;
		
		flushSync();
		
		expect(walletState.connected).toBe(true);
		
		walletState.account = undefined;
		
		flushSync();
		
		expect(walletState.connected).toBe(false);
	});

	test('singleton pattern works correctly', () => {
		const state1 = createWalletState({ clusters: mockClusters });
		const state2 = getWalletState();
		
		expect(state1).toBe(state2);
	});

	test('throws error when accessing uninitialized state', () => {
		destroyWalletState();
		
		expect(() => getWalletState()).toThrow('Wallet state not initialized');
	});

	test('destroy cleans up state', () => {
		walletState.destroy();
		
		expect(walletState.client).toBeUndefined();
	});
});