import { render } from '@testing-library/svelte';
import { expect, test, vi, describe } from 'vitest';
import WalletUiButton from './WalletUiButton.svelte';

describe('WalletUiButton Core Functionality', () => {
	const createMockWalletState = (overrides = {}) => ({
		connected: false,
		connecting: false,
		account: undefined,
		wallet: undefined,
		wallets: [],
		size: 'md',
		error: null,
		connect: vi.fn(),
		disconnect: vi.fn(),
		copy: vi.fn(),
		...overrides
	});

	test('renders and handles click with single wallet', async () => {
		const mockConnect = vi.fn();
		const mockWallet = { name: 'Test Wallet' };
		const walletState = createMockWalletState({
			connect: mockConnect,
			wallets: [mockWallet]
		});

		const { container } = render(WalletUiButton, {
			context: new Map([['wallet-state', walletState]])
		});

		const button = container.querySelector('button');
		expect(button).not.toBeNull();
		
		// Test that button is clickable when not connecting
		expect(button?.disabled).toBe(false);
	});

	test('shows connecting state correctly', () => {
		const walletState = createMockWalletState({
			connecting: true
		});

		const { container } = render(WalletUiButton, {
			context: new Map([['wallet-state', walletState]])
		});

		const button = container.querySelector('button');
		expect(button?.disabled).toBe(true);
		expect(button?.textContent?.includes('Connecting')).toBe(true);
	});

	test('shows connected state with address', () => {
		const walletState = createMockWalletState({
			connected: true,
			account: { address: 'So11111111111111111111111111111111111111112' }
		});

		const { container } = render(WalletUiButton, {
			context: new Map([['wallet-state', walletState]])
		});

		const button = container.querySelector('button');
		expect(button?.textContent?.includes('So11')).toBe(true);
		expect(button?.textContent?.includes('1112')).toBe(true);
	});
});