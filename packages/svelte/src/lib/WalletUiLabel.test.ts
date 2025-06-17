import { render, screen } from '@testing-library/svelte';
import { expect, test, describe } from 'vitest';
import WalletUiLabel from './WalletUiLabel.svelte';
import type { UiWallet } from 'wallet-standard-svelte';

describe('WalletUiLabel', () => {
	const mockWallet: UiWallet = {
		name: 'Phantom Wallet',
		icon: 'data:image/svg+xml;base64,',
		chains: ['solana:devnet'],
		accounts: [],
		features: []
	} as UiWallet;

	test('renders wallet name correctly', () => {
		render(WalletUiLabel, {
			props: {
				wallet: mockWallet,
				size: 'md'
			}
		});

		const label = screen.getByText('Phantom Wallet');
		expect(label).toBeInTheDocument();
	});

	test('applies size styling correctly', () => {
		const { container } = render(WalletUiLabel, {
			props: {
				wallet: mockWallet,
				size: 'lg'
			}
		});

		const label = container.firstChild as HTMLElement;
		expect(label).toBeInTheDocument();
	});

	test('applies custom class', () => {
		const { container } = render(WalletUiLabel, {
			props: {
				wallet: mockWallet,
				size: 'md',
				class: 'custom-label-class'
			}
		});

		const label = container.firstChild as HTMLElement;
		expect(label).toHaveClass('custom-label-class');
	});

	test('defaults to medium size when no size provided', () => {
		const { container } = render(WalletUiLabel, {
			props: {
				wallet: mockWallet
			}
		});

		const label = container.firstChild as HTMLElement;
		expect(label).toBeInTheDocument();
	});

	test('handles empty wallet name', () => {
		const walletWithoutName = {
			...mockWallet,
			name: ''
		};

		render(WalletUiLabel, {
			props: {
				wallet: walletWithoutName,
				size: 'md'
			}
		});

		// Should render empty label
		const label = screen.getByText('');
		expect(label).toBeInTheDocument();
	});

	test('handles special characters in wallet name', () => {
		const specialWallet = {
			...mockWallet,
			name: 'Wallet & Co. (v2.0)'
		};

		render(WalletUiLabel, {
			props: {
				wallet: specialWallet,
				size: 'md'
			}
		});

		const label = screen.getByText('Wallet & Co. (v2.0)');
		expect(label).toBeInTheDocument();
	});
});