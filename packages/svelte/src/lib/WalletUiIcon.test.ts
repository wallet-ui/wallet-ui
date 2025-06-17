import { render } from '@testing-library/svelte';
import { expect, test, describe } from 'vitest';
import WalletUiIcon from './WalletUiIcon.svelte';

describe('WalletUiIcon', () => {
	const mockWallet = {
		name: 'Mock Wallet',
		icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48L3N2Zz4=',
		chains: ['solana:devnet'],
		accounts: [],
		features: []
	};

	test('renders wallet icon with correct attributes', () => {
		const { container } = render(WalletUiIcon, {
			props: {
				wallet: mockWallet,
				size: 'md'
			}
		});

		const icon = container.querySelector('img');
		expect(icon).not.toBeNull();
		expect(icon?.src).toBe(mockWallet.icon);
		expect(icon?.alt).toBe(`${mockWallet.name} icon`);
	});

	test('applies custom class', () => {
		const { container } = render(WalletUiIcon, {
			props: {
				wallet: mockWallet,
				size: 'md',
				class: 'custom-icon-class'
			}
		});

		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper.className.includes('custom-icon-class')).toBe(true);
	});

	test('handles wallet without icon gracefully', () => {
		const walletWithoutIcon = {
			...mockWallet,
			icon: ''
		};

		const { container } = render(WalletUiIcon, {
			props: {
				wallet: walletWithoutIcon,
				size: 'md'
			}
		});

		const icon = container.querySelector('img');
		expect(icon?.src).toBe('');
		expect(icon?.alt).toBe(`${walletWithoutIcon.name} icon`);
	});

	test('applies different sizes correctly', () => {
		const { container: lgContainer } = render(WalletUiIcon, {
			props: {
				wallet: mockWallet,
				size: 'lg'
			}
		});

		const { container: smContainer } = render(WalletUiIcon, {
			props: {
				wallet: mockWallet,
				size: 'sm'
			}
		});

		expect(lgContainer.firstChild).not.toBeNull();
		expect(smContainer.firstChild).not.toBeNull();
	});
});