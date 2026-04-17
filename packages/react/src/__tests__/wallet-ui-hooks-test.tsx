import type { UiWallet, UiWalletAccount } from '@wallet-standard/react';

import { BaseDropdownItemType } from '../base-dropdown';
import { renderHook } from '../test-renderer';
import { createAccount, createWallet } from '../test-utils/wallet-ui-test-utils';
import { useWalletUiDropdown, ellipsify } from '../use-wallet-ui-dropdown';
import { useWalletUiSigner } from '../use-wallet-ui-signer';
import { useWalletUiWallet } from '../use-wallet-ui-wallet';

const mockUseBaseDropdown = jest.fn();
const mockUseConnect = jest.fn();
const mockUseDisconnect = jest.fn();
const mockUseWalletAccountTransactionSendingSigner = jest.fn();
const mockUseWalletUi = jest.fn();
const mockUseWalletUiAccount = jest.fn();
const TEST_ICON = 'data:image/png;base64,ZmFrZQ==';

jest.mock('react-error-boundary', () => {
    const React = jest.requireActual<typeof import('react')>('react');

    return {
        ErrorBoundary: ({ children }: { children: React.ReactNode }) =>
            React.createElement(React.Fragment, null, children),
    };
});

jest.mock('@solana/react', () => ({
    useWalletAccountTransactionSendingSigner: (...args: unknown[]) =>
        mockUseWalletAccountTransactionSendingSigner(...args),
}));

jest.mock('@wallet-standard/react', () => ({
    useConnect: (...args: unknown[]) => mockUseConnect(...args),
    useDisconnect: (...args: unknown[]) => mockUseDisconnect(...args),
}));

jest.mock('../use-base-dropdown', () => ({
    useBaseDropdown: () => mockUseBaseDropdown(),
}));

jest.mock('../use-wallet-ui', () => ({
    useWalletUi: () => mockUseWalletUi(),
}));

jest.mock('../use-wallet-ui-account', () => ({
    useWalletUiAccount: () => mockUseWalletUiAccount(),
}));

describe('ellipsify', () => {
    it('leaves short strings unchanged and truncates long strings', () => {
        expect(ellipsify('1234567')).toBe('1234567');
        expect(ellipsify('1234567890')).toBe('1234..7890');
    });
});

describe('useWalletUiDropdown', () => {
    it('builds connect items for disconnected wallets', async () => {
        expect.assertions(7);

        const account = createUiWalletAccount({ address: 'phantom-1', walletName: 'Phantom' });
        const connect = jest.fn();
        const dropdown = createDropdownControl();
        const wallet = createUiWallet({ accounts: [account], name: 'Phantom' });

        mockUseBaseDropdown.mockReturnValue(dropdown);
        mockUseWalletUi.mockReturnValue({
            account: undefined,
            connect,
            connected: false,
            copy: jest.fn(),
            disconnect: jest.fn(),
            wallet: undefined,
            wallets: [wallet],
        });

        const hook = getHookResult(renderHook(() => useWalletUiDropdown()).result);

        expect(hook.buttonProps.label).toBe('Select Wallet');
        expect(hook.buttonProps.leftSection).toBeUndefined();
        expect(hook.connected).toBe(false);
        expect(hook.dropdown).toBe(dropdown);
        expect(hook.items.map(item => item.label)).toEqual(['Phantom']);
        expect(hook.items[0]?.type).toBe(BaseDropdownItemType.WalletConnect);

        await hook.items[0]?.handler();

        expect(connect).toHaveBeenCalledWith(account);
    });

    it('falls back to the wallet-needed action when no wallets are available', async () => {
        expect.assertions(3);

        const dropdown = createDropdownControl();
        const open = jest.fn();
        const restoreWindow = stubWindowOpen(open);

        mockUseBaseDropdown.mockReturnValue(dropdown);
        mockUseWalletUi.mockReturnValue({
            account: undefined,
            connect: jest.fn(),
            connected: false,
            copy: jest.fn(),
            disconnect: jest.fn(),
            wallet: undefined,
            wallets: [],
        });

        try {
            const hook = getHookResult(renderHook(() => useWalletUiDropdown()).result);

            expect(hook.items.map(item => item.label)).toEqual(["You'll need a wallet on Solana to continue"]);
            expect(hook.items[0]?.type).toBe(BaseDropdownItemType.WalletNeeded);

            await hook.items[0]?.handler();

            expect(open).toHaveBeenCalledWith('https://solana.com/solana-wallets', '_blank');
        } finally {
            restoreWindow();
        }
    });

    it('builds copy and disconnect actions for connected wallets', async () => {
        expect.assertions(5);

        const account = createUiWalletAccount({ address: '1234567890', walletName: 'Phantom' });
        const copy = jest.fn();
        const disconnect = jest.fn();
        const dropdown = createDropdownControl();
        const wallet = createUiWallet({ accounts: [account], icon: TEST_ICON, name: 'Phantom' });

        mockUseBaseDropdown.mockReturnValue(dropdown);
        mockUseWalletUi.mockReturnValue({
            account,
            connect: jest.fn(),
            connected: true,
            copy,
            disconnect,
            wallet,
            wallets: [wallet],
        });

        const hook = getHookResult(renderHook(() => useWalletUiDropdown()).result);

        expect(hook.buttonProps.label).toBe('1234..7890');
        expect(hook.items.map(item => item.label)).toEqual(['Copy Address', 'Disconnect', 'Phantom']);

        await hook.items[0]?.handler();
        await hook.items[1]?.handler();

        expect(copy).toHaveBeenCalled();
        expect(disconnect).toHaveBeenCalled();
        expect(dropdown.close).toHaveBeenCalled();
    });

    it('falls back to the wallet name and connected label when the account is missing', () => {
        expect.assertions(2);

        const dropdown = createDropdownControl();
        const wallet = createUiWallet({ accounts: [], icon: TEST_ICON, name: 'Phantom' });

        mockUseBaseDropdown.mockReturnValue(dropdown);
        mockUseWalletUi
            .mockReturnValueOnce({
                account: undefined,
                connect: jest.fn(),
                connected: true,
                copy: jest.fn(),
                disconnect: jest.fn(),
                wallet,
                wallets: [wallet],
            })
            .mockReturnValueOnce({
                account: undefined,
                connect: jest.fn(),
                connected: true,
                copy: jest.fn(),
                disconnect: jest.fn(),
                wallet: undefined,
                wallets: [],
            });

        const hook = renderHook(() => useWalletUiDropdown());

        expect(getHookResult(hook.result).buttonProps.label).toBe('Phantom');

        hook.rerenderHook(() => useWalletUiDropdown());

        expect(getHookResult(hook.result).buttonProps.label).toBe('Connected');
    });
});

describe('useWalletUiSigner', () => {
    it('delegates to the Solana signer hook with the selected cluster id', () => {
        const account = createAccount({ address: 'phantom-1', walletName: 'Phantom' }) as unknown as UiWalletAccount;
        const signer = { send: jest.fn() };

        mockUseWalletAccountTransactionSendingSigner.mockReturnValue(signer);
        mockUseWalletUi.mockReturnValue({
            cluster: {
                id: 'solana:testnet',
            },
        });

        const hook = renderHook(() => useWalletUiSigner({ account }));

        expect(hook.result.current).toBe(signer);
        expect(mockUseWalletAccountTransactionSendingSigner).toHaveBeenCalledWith(account, 'solana:testnet');
    });
});

describe('useWalletUiWallet', () => {
    it('connects the first account and exposes the wallet loading state', async () => {
        expect.assertions(6);

        const account = createUiWalletAccount({ address: 'phantom-1', walletName: 'Phantom' });
        const connect = jest.fn().mockResolvedValue([account]);
        const connectAccount = jest.fn();
        const disconnect = jest.fn().mockResolvedValue(undefined);
        const setAccount = jest.fn();
        const wallet = createUiWallet({ accounts: [account], name: 'Phantom' });

        mockUseConnect.mockReturnValue([true, connect]);
        mockUseDisconnect.mockReturnValue([false, disconnect]);
        mockUseWalletUi.mockReturnValue({ connect: connectAccount });
        mockUseWalletUiAccount.mockReturnValue({ setAccount });

        const hook = getHookResult(renderHook(() => useWalletUiWallet({ wallet })).result);

        expect(hook.isConnecting).toBe(true);
        expect(hook.isDisconnecting).toBe(false);

        await expect(hook.connect()).resolves.toEqual([account]);
        await hook.disconnect();

        expect(setAccount).toHaveBeenCalledWith(account);
        expect(connectAccount).toHaveBeenCalledWith(account);
        expect(disconnect).toHaveBeenCalled();
    });

    it('warns and skips account selection when connect returns no accounts', async () => {
        expect.assertions(6);

        const connect = jest.fn().mockResolvedValue([]);
        const connectAccount = jest.fn();
        const disconnect = jest.fn();
        const setAccount = jest.fn();
        const wallet = createUiWallet({ accounts: [], name: 'Phantom' });

        mockUseConnect.mockReturnValue([false, connect]);
        mockUseDisconnect.mockReturnValue([true, disconnect]);
        mockUseWalletUi.mockReturnValue({ connect: connectAccount });
        mockUseWalletUiAccount.mockReturnValue({ setAccount });

        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        try {
            const hook = getHookResult(renderHook(() => useWalletUiWallet({ wallet })).result);

            expect(hook.isConnecting).toBe(false);
            expect(hook.isDisconnecting).toBe(true);

            await expect(hook.connect()).resolves.toEqual([]);

            expect(warn).toHaveBeenCalledWith('Connect to Phantom but there are no accounts.');
            expect(connectAccount).not.toHaveBeenCalled();
            expect(setAccount).not.toHaveBeenCalled();
        } finally {
            warn.mockRestore();
        }
    });
});

function createDropdownControl() {
    return {
        api: {},
        close: jest.fn(),
        open: jest.fn(),
    };
}

function stubWindowOpen(open: jest.Mock) {
    if (typeof window !== 'undefined') {
        const spy = jest.spyOn(window, 'open').mockImplementation(((...args) => {
            open(...args);
            return null;
        }) as typeof window.open);

        return () => {
            spy.mockRestore();
        };
    }

    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');

    Object.defineProperty(globalThis, 'window', {
        configurable: true,
        value: {
            open,
        },
    });

    return () => {
        if (descriptor) {
            Object.defineProperty(globalThis, 'window', descriptor);
        } else {
            Reflect.deleteProperty(globalThis, 'window');
        }
    };
}

function createUiWallet({
    accounts = [],
    icon,
    name,
}: {
    accounts?: UiWalletAccount[];
    icon?: UiWallet['icon'];
    name: string;
}): UiWallet {
    return {
        ...(createWallet({
            accounts: accounts as unknown as ReturnType<typeof createAccount>[],
            name,
        }) as unknown as UiWallet),
        ...(icon ? { icon } : {}),
    };
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

function getHookResult<T>(result: { __type: 'error'; current: Error } | { __type: 'result'; current?: T }): T {
    if (result.__type === 'error') {
        throw result.current;
    }
    if (result.current === undefined) {
        throw new Error('Missing hook result');
    }
    return result.current;
}
