import { expect, test, describe, vi } from 'vitest';
import { getContext } from 'svelte';
import { useWalletUi } from './use-wallet-ui.js';
import type { WalletState } from './wallet-state.svelte.js';

// Mock svelte context functions
vi.mock('svelte', async () => {
	const actual = await vi.importActual('svelte');
	return {
		...actual,
		getContext: vi.fn()
	};
});

describe('useWalletUi', () => {
	test('returns wallet state when context exists', () => {
		const mockWalletState = { connected: false } as WalletState;
		
		vi.mocked(getContext).mockReturnValue(mockWalletState);
		
		const result = useWalletUi();
		
		expect(result).toBe(mockWalletState);
		expect(getContext).toHaveBeenCalledWith('wallet-state');
	});

	test('throws error when context does not exist', () => {
		vi.mocked(getContext).mockReturnValue(undefined);
		
		expect(() => useWalletUi()).toThrow(
			'useWalletUi must be used within a WalletUi component'
		);
	});

	test('throws error when context is null', () => {
		vi.mocked(getContext).mockReturnValue(null);
		
		expect(() => useWalletUi()).toThrow(
			'useWalletUi must be used within a WalletUi component'
		);
	});
});