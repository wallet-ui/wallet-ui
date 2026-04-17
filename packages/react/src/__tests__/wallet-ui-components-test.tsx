import type { UiWallet, UiWalletAccount } from '@wallet-standard/react';
import React from 'react';
import { act, create } from 'react-test-renderer';
import type { BaseModalProps } from '../base-modal';
import type { BaseModalControl } from '../use-base-modal';

import { type WalletUiAccountState, WalletUiAccountContext } from '../wallet-ui-account-context';
import { WalletUiAccountGuard } from '../wallet-ui-account-guard';
import { type WalletUiClusterContextValue, WalletUiClusterContext } from '../wallet-ui-cluster-context';
import { WalletUiClusterDropdown } from '../wallet-ui-cluster-dropdown';
import { WalletUiDropdown } from '../wallet-ui-dropdown';
import { WalletUiIconClose } from '../wallet-ui-icon-close';
import { WalletUiIconNoWallet } from '../wallet-ui-icon-no-wallet';
import { WalletUiIcon } from '../wallet-ui-icon';
import { WalletUiLabel } from '../wallet-ui-label';
import { WalletUiListButton } from '../wallet-ui-list-button';
import { WalletUiList } from '../wallet-ui-list';
import { WalletUiModalTrigger } from '../wallet-ui-modal-trigger';
import { WalletUiModal } from '../wallet-ui-modal';
import { createAccount, createWallet } from '../test-utils/wallet-ui-test-utils';

const mockBaseModal = jest.fn();
const mockUseBaseDropdown = jest.fn();
const mockUseWalletUiDropdown = jest.fn();
const TEST_ICON = 'data:image/png;base64,ZmFrZQ==';

afterEach(() => {
    mockBaseModal.mockReset();
    mockUseBaseDropdown.mockReset();
    mockUseWalletUiDropdown.mockReset();
});

jest.mock('../base-modal', () => {
    const React = jest.requireActual<typeof import('react')>('react');

    return {
        BaseModal: (props: BaseModalProps) => {
            mockBaseModal(props);
            return React.createElement(React.Fragment, null, props.children);
        },
    };
});

jest.mock('../use-base-dropdown', () => ({
    useBaseDropdown: () => mockUseBaseDropdown(),
}));

jest.mock('../use-wallet-ui-dropdown', () => ({
    useWalletUiDropdown: () => mockUseWalletUiDropdown(),
}));

describe('WalletUiAccountGuard', () => {
    const cleanups: Array<() => void> = [];

    afterEach(() => {
        for (const cleanup of cleanups.splice(0).reverse()) {
            cleanup();
        }
    });

    it('renders the default dropdown fallback when no account is selected', () => {
        const accountContext = createAccountContextValue({ account: undefined, wallet: undefined });
        const dropdown = createDropdownControl();

        mockUseWalletUiDropdown.mockReturnValue({
            buttonProps: {
                label: 'Connect Wallet',
            },
            connected: false,
            dropdown,
            items: [],
        });

        const renderer = render(
            cleanups,
            <WalletUiAccountContext.Provider value={accountContext}>
                <WalletUiAccountGuard render={() => null} />
            </WalletUiAccountContext.Provider>,
        );

        const button = renderer.root.findByProps({ 'data-wu': 'base-button' });

        expect(button.children).toContain('Connect Wallet');
    });

    it('renders the account info when an account is selected', () => {
        const account = createUiWalletAccount({ address: 'phantom-1', walletName: 'Phantom' });
        const wallet = createUiWallet({ accounts: [account], name: 'Phantom' });
        const accountContext = createAccountContextValue({ account, wallet });
        const renderAccount = jest.fn(() => <span>Connected account</span>);

        const renderer = render(
            cleanups,
            <WalletUiAccountContext.Provider value={accountContext}>
                <WalletUiAccountGuard render={renderAccount} />
            </WalletUiAccountContext.Provider>,
        );

        expect(renderAccount).toHaveBeenCalledWith({
            account,
            accountKeys: ['solana:testnet', 'Phantom:phantom-1'],
            cluster: accountContext.cluster,
            wallet,
        });
        expect(renderer.root.findByType('span').children).toEqual(['Connected account']);
    });
});

describe('WalletUiClusterDropdown', () => {
    const cleanups: Array<() => void> = [];

    afterEach(() => {
        for (const cleanup of cleanups.splice(0).reverse()) {
            cleanup();
        }
    });

    it('renders the selected cluster label and updates the cluster selection', async () => {
        expect.assertions(4);

        const dropdown = createDropdownControl();
        const setCluster = jest.fn();

        mockUseBaseDropdown.mockReturnValue(dropdown);

        const renderer = render(
            cleanups,
            <WalletUiClusterContext.Provider
                value={createClusterContextValue({
                    setCluster,
                })}
            >
                <WalletUiClusterDropdown buttonProps={{ className: 'cluster-trigger' }} />
            </WalletUiClusterContext.Provider>,
        );

        const button = renderer.root.findByProps({ 'data-wu': 'base-button' });
        const items = renderer.root.findAllByProps({ 'data-wu': 'base-dropdown-item' });

        expect(button.children).toContain('Devnet');
        expect(button.props.className).toContain('cluster-trigger');

        await act(async () => {
            items[1]?.props.onClick();
            await Promise.resolve();
            await Promise.resolve();
        });

        expect(setCluster).toHaveBeenCalledWith('solana:testnet');
        expect(dropdown.close).toHaveBeenCalled();
    });
});

describe('WalletUiDropdown', () => {
    const cleanups: Array<() => void> = [];

    afterEach(() => {
        for (const cleanup of cleanups.splice(0).reverse()) {
            cleanup();
        }
    });

    it('renders the dropdown button using the wallet-ui dropdown hook output', () => {
        const dropdown = createDropdownControl();

        mockUseWalletUiDropdown.mockReturnValue({
            buttonProps: {
                label: 'Select Wallet',
            },
            connected: false,
            dropdown,
            items: [],
        });

        const renderer = render(cleanups, <WalletUiDropdown />);
        const button = renderer.root.findByProps({ 'data-wu': 'base-button' });

        expect(button.children).toContain('Select Wallet');
    });
});

describe('WalletUiIcon', () => {
    const cleanups: Array<() => void> = [];

    afterEach(() => {
        for (const cleanup of cleanups.splice(0).reverse()) {
            cleanup();
        }
    });

    it('renders a wallet image when wallet metadata is provided', () => {
        const wallet = {
            icon: TEST_ICON,
            name: 'Phantom',
        } satisfies Pick<UiWallet, 'icon' | 'name'>;
        const renderer = render(cleanups, <WalletUiIcon className="wallet-icon" wallet={wallet} />);
        const image = renderer.root.findByType('img');

        expect(image.props.alt).toBe('Phantom');
        expect(image.props.className).toBe('wallet-icon');
        expect(image.props.src).toBe(TEST_ICON);
    });

    it('returns null when the wallet is missing', () => {
        const renderer = render(cleanups, <WalletUiIcon />);

        expect(renderer.toJSON()).toBeNull();
    });
});

describe('WalletUiIconClose', () => {
    const cleanups: Array<() => void> = [];

    afterEach(() => {
        for (const cleanup of cleanups.splice(0).reverse()) {
            cleanup();
        }
    });

    it('renders the close icon svg', () => {
        const renderer = render(cleanups, <WalletUiIconClose className="close-icon" />);
        const svg = renderer.root.findByType('svg');

        expect(svg.props.className).toBe('close-icon');
        expect(svg.props.viewBox).toBe('0 0 14 14');
    });
});

describe('WalletUiIconNoWallet', () => {
    const cleanups: Array<() => void> = [];

    afterEach(() => {
        for (const cleanup of cleanups.splice(0).reverse()) {
            cleanup();
        }
    });

    it('renders the no-wallet illustration svg', () => {
        const renderer = render(cleanups, <WalletUiIconNoWallet className="no-wallet-icon" />);
        const svg = renderer.root.findByType('svg');

        expect(svg.props.className).toBe('no-wallet-icon');
        expect(svg.props.viewBox).toBe('0 0 97 96');
    });
});

describe('WalletUiLabel', () => {
    const cleanups: Array<() => void> = [];

    afterEach(() => {
        for (const cleanup of cleanups.splice(0).reverse()) {
            cleanup();
        }
    });

    it('renders the wallet name when wallet metadata is provided', () => {
        const wallet = createWallet({ name: 'Phantom' });
        const renderer = render(cleanups, <WalletUiLabel className="wallet-label" wallet={wallet} />);
        const label = renderer.root.findByProps({ 'data-wu': 'wallet-ui-label' });

        expect(label.children).toEqual(['Phantom']);
        expect(label.props.className).toBe('wallet-label');
    });

    it('returns null when the wallet is missing', () => {
        const renderer = render(cleanups, <WalletUiLabel />);

        expect(renderer.toJSON()).toBeNull();
    });
});

describe('WalletUiList', () => {
    const cleanups: Array<() => void> = [];

    afterEach(() => {
        for (const cleanup of cleanups.splice(0).reverse()) {
            cleanup();
        }
    });

    it('renders one list button per wallet', () => {
        const phantom = createUiWallet({ name: 'Phantom' });
        const solflare = createUiWallet({ name: 'Solflare' });
        const renderer = render(cleanups, <WalletUiList wallets={[phantom, solflare]} />);

        expect(renderer.root.findByProps({ 'data-wu': 'wallet-ui-list' })).toBeDefined();
        expect(renderer.root.findAllByProps({ 'data-wu': 'wallet-ui-list-button' })).toHaveLength(2);
    });
});

describe('WalletUiListButton', () => {
    const cleanups: Array<() => void> = [];

    afterEach(() => {
        for (const cleanup of cleanups.splice(0).reverse()) {
            cleanup();
        }
    });

    it('is a no-op when no select handler is provided', () => {
        const account = createUiWalletAccount({ address: 'phantom-1', walletName: 'Phantom' });
        const renderer = render(
            cleanups,
            <WalletUiListButton wallet={createUiWallet({ accounts: [account], name: 'Phantom' })} />,
        );
        const button = renderer.root.findByProps({ 'data-wu': 'wallet-ui-list-button' });

        act(() => {
            button.props.onClick();
        });

        expect(button.props.className).not.toContain('pending');
        expect(button.props.disabled).toBe(false);
    });

    it('sets the button to pending until the selection resolves', async () => {
        expect.assertions(4);

        const account = createUiWalletAccount({ address: 'phantom-1', walletName: 'Phantom' });
        const deferred = createDeferred<void>();
        const renderer = render(
            cleanups,
            <WalletUiListButton
                select={jest.fn(() => deferred.promise)}
                wallet={createUiWallet({ accounts: [account], name: 'Phantom' })}
            />,
        );

        act(() => {
            renderer.root.findByProps({ 'data-wu': 'wallet-ui-list-button' }).props.onClick();
        });

        expect(renderer.root.findByProps({ 'data-wu': 'wallet-ui-list-button' }).props.className).toContain('pending');
        expect(renderer.root.findByProps({ 'data-wu': 'wallet-ui-list-button' }).props.disabled).toBe(true);

        await act(async () => {
            deferred.resolve();
            await deferred.promise;
        });

        expect(renderer.root.findByProps({ 'data-wu': 'wallet-ui-list-button' }).props.className).not.toContain(
            'pending',
        );
        expect(renderer.root.findByProps({ 'data-wu': 'wallet-ui-list-button' }).props.disabled).toBe(false);
    });

    it('clears the pending state when the selection rejects', async () => {
        expect.assertions(4);

        const account = createUiWalletAccount({ address: 'phantom-1', walletName: 'Phantom' });
        const deferred = createDeferred<void>();
        const select = jest.fn(() => deferred.promise.catch(() => undefined));
        const renderer = render(
            cleanups,
            <WalletUiListButton
                select={select}
                wallet={createUiWallet({ accounts: [account], name: 'Phantom' })}
            />,
        );

        act(() => {
            renderer.root.findByProps({ 'data-wu': 'wallet-ui-list-button' }).props.onClick();
        });

        expect(renderer.root.findByProps({ 'data-wu': 'wallet-ui-list-button' }).props.className).toContain('pending');
        expect(renderer.root.findByProps({ 'data-wu': 'wallet-ui-list-button' }).props.disabled).toBe(true);

        await act(async () => {
            deferred.reject(new Error('Selection failed'));
            await Promise.resolve();
            await Promise.resolve();
        });

        expect(renderer.root.findByProps({ 'data-wu': 'wallet-ui-list-button' }).props.className).not.toContain(
            'pending',
        );
        expect(renderer.root.findByProps({ 'data-wu': 'wallet-ui-list-button' }).props.disabled).toBe(false);
    });
});

describe('WalletUiModal', () => {
    const cleanups: Array<() => void> = [];

    afterEach(() => {
        for (const cleanup of cleanups.splice(0).reverse()) {
            cleanup();
        }
    });

    it('passes the Solana wallet description to the base modal and renders the wallet list', () => {
        const account = createUiWalletAccount({ address: 'phantom-1', walletName: 'Phantom' });
        const modal = createModalControl();
        const select = jest.fn();
        const renderer = render(
            cleanups,
            <WalletUiModal
                modal={modal}
                select={select}
                wallets={[createUiWallet({ accounts: [account], name: 'Phantom' })]}
            />,
        );

        expect(mockBaseModal).toHaveBeenCalledTimes(1);
        expect(mockBaseModal).toHaveBeenCalledWith(
            expect.objectContaining({
                description: 'Connect a wallet on Solana to continue',
                modal,
            }),
        );
        expect(renderer.root.findAllByProps({ 'data-wu': 'wallet-ui-list-button' })).toHaveLength(1);
    });
});

describe('WalletUiModalTrigger', () => {
    const cleanups: Array<() => void> = [];

    afterEach(() => {
        for (const cleanup of cleanups.splice(0).reverse()) {
            cleanup();
        }
    });

    it('opens the modal and uses the default button label', () => {
        const modal = createModalControl();
        const renderer = render(cleanups, <WalletUiModalTrigger modal={modal} />);
        const button = renderer.root.findByProps({ 'data-wu': 'base-button' });

        act(() => {
            button.props.onClick();
        });

        expect(button.children).toContain('Select Wallet');
        expect(modal.open).toHaveBeenCalled();
    });
});

function createAccountContextValue({
    account,
    wallet,
}: {
    account: UiWalletAccount | undefined;
    wallet: UiWallet | undefined;
}): WalletUiAccountState {
    return {
        account,
        accountKeys: account
            ? ['solana:testnet', `${(account as unknown as { walletName: string }).walletName}:${account.address}`]
            : [],
        cluster: {
            id: 'solana:testnet',
            label: 'Testnet',
            url: 'https://api.testnet.solana.com',
        },
        setAccount: jest.fn(),
        wallet,
    };
}

function createClusterContextValue({
    setCluster,
}: {
    setCluster: jest.Mock;
}): WalletUiClusterContextValue {
    return {
        cluster: {
            id: 'solana:devnet',
            label: 'Devnet',
            url: 'https://api.devnet.solana.com',
        },
        clusters: [
            {
                id: 'solana:devnet',
                label: 'Devnet',
                url: 'https://api.devnet.solana.com',
            },
            {
                id: 'solana:testnet',
                label: 'Testnet',
                url: 'https://api.testnet.solana.com',
            },
        ],
        setCluster,
    };
}

function createDeferred<T>() {
    let reject!: (reason?: unknown) => void;
    let resolve!: (value: T | PromiseLike<T>) => void;

    const promise = new Promise<T>((res, rej) => {
        reject = rej;
        resolve = res;
    });

    return {
        promise,
        reject,
        resolve,
    };
}

function createDropdownControl() {
    return {
        api: {
            getContentProps: () => ({}),
            getIndicatorProps: () => ({}),
            getItemProps: ({ value }: { value: string }) => ({
                'data-value': value,
            }),
            getPositionerProps: () => ({}),
            getTriggerProps: () => ({}),
        },
        close: jest.fn(),
        open: jest.fn(),
    };
}

function createModalControl() {
    return {
        api: {} as BaseModalControl['api'],
        close: jest.fn(),
        open: jest.fn(),
    };
}

function createUiWallet({
    accounts = [],
    name,
}: {
    accounts?: UiWalletAccount[];
    name: string;
}): UiWallet {
    return createWallet({
        accounts: accounts as unknown as ReturnType<typeof createAccount>[],
        name,
    }) as unknown as UiWallet;
}

function createUiWalletAccount({
    address,
    walletName,
}: {
    address: string;
    walletName: string;
}): UiWalletAccount {
    return createAccount({ address, walletName }) as unknown as UiWalletAccount;
}

function render(cleanups: Array<() => void>, element: React.ReactElement) {
    let renderer!: ReturnType<typeof create>;

    act(() => {
        renderer = create(element);
    });

    cleanups.push(() => {
        act(() => {
            renderer.unmount();
        });
    });

    return renderer;
}
