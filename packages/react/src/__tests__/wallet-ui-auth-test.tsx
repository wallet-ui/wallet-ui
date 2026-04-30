import { SolanaSignIn, type SolanaSignInInput, SolanaSignMessage } from '@solana/wallet-standard-features';
import { createSignInMessage } from '@solana/wallet-standard-util';
import { StandardConnect, type WalletAccount } from '@wallet-standard/core';
import type { UiWallet, UiWalletAccount } from '@wallet-standard/ui';
import React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

import {
    useWalletUiAuth,
    WalletUiAuthError,
    type WalletUiAuthResult,
    type WalletUiAuthState,
} from '../use-wallet-ui-auth';
import { useWalletUiAuthMessage } from '../use-wallet-ui-auth-message';
import { useWalletUiAuthNative } from '../use-wallet-ui-auth-native';
import { WalletUiAuth } from '../wallet-ui-auth';

const mockUiWalletAccountBelongsToUiWallet = jest.fn();
const mockGetOrCreateUiWalletAccountForStandardWalletAccount = jest.fn();
const mockGetWalletAccountForUiWalletAccount = jest.fn();
const mockGetWalletAccountFeature = jest.fn();
const mockGetWalletFeature = jest.fn();
const mockGetWalletForHandle = jest.fn();
const mockUseConnect = jest.fn();
const mockUseSignMessage = jest.fn();
const mockUseWalletUi = jest.fn();

jest.mock('@solana/react', () => ({
    useSignMessage: (...args: unknown[]) => mockUseSignMessage(...args),
}));

jest.mock('@wallet-standard/react', () => ({
    useConnect: (...args: unknown[]) => mockUseConnect(...args),
}));

jest.mock('@wallet-standard/ui', () => ({
    getWalletAccountFeature: (...args: unknown[]) => mockGetWalletAccountFeature(...args),
    getWalletFeature: (...args: unknown[]) => mockGetWalletFeature(...args),
    uiWalletAccountBelongsToUiWallet: (...args: unknown[]) => mockUiWalletAccountBelongsToUiWallet(...args),
}));

jest.mock('@wallet-standard/ui-registry', () => ({
    getOrCreateUiWalletAccountForStandardWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: (...args: unknown[]) =>
        mockGetOrCreateUiWalletAccountForStandardWalletAccount(...args),
    getWalletAccountForUiWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: (...args: unknown[]) =>
        mockGetWalletAccountForUiWalletAccount(...args),
    getWalletForHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: (...args: unknown[]) => mockGetWalletForHandle(...args),
}));

jest.mock('../use-wallet-ui', () => ({
    useWalletUi: () => mockUseWalletUi(),
}));

describe('WalletUiAuth', () => {
    beforeEach(() => {
        mockGetOrCreateUiWalletAccountForStandardWalletAccount.mockReset();
        mockGetWalletAccountForUiWalletAccount.mockReset();
        mockGetWalletAccountFeature.mockReset();
        mockGetWalletFeature.mockReset();
        mockGetWalletForHandle.mockReset();
        mockUiWalletAccountBelongsToUiWallet.mockReset();
        mockUseConnect.mockReset();
        mockUseSignMessage.mockReset();
        mockUseWalletUi.mockReset();

        mockUiWalletAccountBelongsToUiWallet.mockImplementation(
            (account: TestUiWalletAccount, wallet: TestUiWallet) => account.wallet === wallet,
        );
        mockGetWalletAccountForUiWalletAccount.mockImplementation((account: TestUiWalletAccount) => account);
        mockUseConnect.mockReturnValue([false, jest.fn().mockResolvedValue([])]);
    });

    it('exposes a headless hook for a wallet', async () => {
        const account = createTestAccount({ address: 'phantom-1', features: [SolanaSignMessage] });
        const wallet = createTestWallet({
            accounts: [account],
            features: [SolanaSignIn, SolanaSignMessage],
            name: 'Phantom',
        });
        const connect = jest.fn();
        const nativeSignIn = createNativeSignIn(account);

        mockGetWalletFeature.mockReturnValue({
            signIn: nativeSignIn.signIn,
            version: '1.0.0',
        });
        mockUseWalletUi.mockReturnValue({ account, connect, wallet, wallets: [wallet] });

        const view = renderAuthHook(wallet);
        const auth = view.getState();

        expect(auth.canSignIn).toBe(true);
        expect(auth.nativeSignInAvailable).toBe(true);

        await act(async () => {
            await auth.signIn({
                input: {
                    domain: 'example.com',
                },
            });
        });

        expect(nativeSignIn.signIn).toHaveBeenCalledWith({
            address: 'phantom-1',
            domain: 'example.com',
        });
        expect(connect).toHaveBeenCalledWith(account);

        view.unmount();
    });

    it('uses native solana:signIn when the wallet supports it', async () => {
        const account = createTestAccount({ address: 'phantom-1', features: [SolanaSignMessage] });
        const wallet = createTestWallet({
            accounts: [account],
            features: [SolanaSignIn, SolanaSignMessage],
            name: 'Phantom',
        });
        const connect = jest.fn();
        const nativeSignIn = createNativeSignIn(account);

        mockGetWalletFeature.mockReturnValue({
            signIn: nativeSignIn.signIn,
            version: '1.0.0',
        });
        mockUseWalletUi.mockReturnValue({ account, connect, wallet, wallets: [wallet] });

        const view = renderAuth(wallet);
        const auth = view.getState();

        expect(auth.canSignIn).toBe(true);
        expect(auth.messageSigningAvailable).toBe(true);
        expect(auth.nativeSignInAvailable).toBe(true);
        expect(auth.reason).toBeUndefined();

        let result!: WalletUiAuthResult;
        await act(async () => {
            result = await auth.signIn({
                input: {
                    domain: 'example.com',
                    nonce: 'abcdefgh',
                },
            });
        });

        expect(nativeSignIn.signIn).toHaveBeenCalledWith({
            address: 'phantom-1',
            domain: 'example.com',
            nonce: 'abcdefgh',
        });
        expect(connect).toHaveBeenCalledWith(account);
        expect(result).toEqual({
            account,
            input: {
                address: 'phantom-1',
                domain: 'example.com',
                nonce: 'abcdefgh',
            },
            method: SolanaSignIn,
            signature: nativeSignIn.signature,
            signedMessage: nativeSignIn.signedMessage,
        });

        view.unmount();
    });

    it('uses native solana:signIn without a connected account or standard connect', async () => {
        const signedInAccount = createTestAccount({ address: 'phantom-1', features: [SolanaSignMessage] });
        const standardAccount = createStandardAccount(signedInAccount);
        const uiAccount = createTestAccount({ address: 'phantom-1', features: [SolanaSignMessage] });
        const wallet = createTestWallet({
            accounts: [],
            features: [SolanaSignIn],
            name: 'Phantom',
        });
        const connect = jest.fn();
        const nativeSignIn = createNativeSignIn(standardAccount);
        const standardWallet = {
            accounts: [standardAccount],
            chains: wallet.chains,
            features: {},
            icon: wallet.icon,
            name: wallet.name,
            version: wallet.version,
        };

        mockGetOrCreateUiWalletAccountForStandardWalletAccount.mockReturnValue(uiAccount);
        mockGetWalletFeature.mockReturnValue({
            signIn: nativeSignIn.signIn,
            version: '1.0.0',
        });
        mockGetWalletForHandle.mockReturnValue(standardWallet);
        mockUseWalletUi.mockReturnValue({ account: undefined, connect, wallet: undefined, wallets: [wallet] });

        const view = renderAuth(wallet);
        const auth = view.getState();

        expect(auth.canSignIn).toBe(true);
        expect(auth.messageSigningAvailable).toBe(false);
        expect(auth.nativeSignInAvailable).toBe(true);

        let result!: WalletUiAuthResult;
        await act(async () => {
            result = await auth.signIn({
                input: {
                    domain: 'example.com',
                },
            });
        });

        expect(nativeSignIn.signIn).toHaveBeenCalledWith({
            domain: 'example.com',
        });
        expect(mockGetWalletForHandle).toHaveBeenCalledWith(wallet);
        expect(mockGetOrCreateUiWalletAccountForStandardWalletAccount).toHaveBeenCalledWith(
            standardWallet,
            standardAccount,
        );
        expect(connect).not.toHaveBeenCalled();
        expect(result.account).toBe(uiAccount);

        view.unmount();
    });

    it('falls back to connected-account message signing when native SIWS is unavailable', async () => {
        const account = createTestAccount({ address: 'solflare-1', features: [SolanaSignMessage] });
        const wallet = createTestWallet({
            accounts: [account],
            features: [StandardConnect, SolanaSignMessage],
            name: 'Solflare',
        });
        const connectWallet = jest.fn().mockResolvedValue([account]);
        const signMessage = createSignMessageSigner();
        const input = {
            domain: 'example.com',
            nonce: 'abcdefgh',
            statement: 'Sign in to Example',
        };
        const expectedInput = {
            ...input,
            address: 'solflare-1',
        };

        mockUseConnect.mockReturnValue([false, connectWallet]);
        mockUseSignMessage.mockReturnValue(signMessage.signMessage);
        mockUseWalletUi.mockReturnValue({ account, connect: jest.fn(), wallet, wallets: [wallet] });

        const view = renderAuth(wallet);
        const auth = view.getState();

        expect(auth.canSignIn).toBe(true);
        expect(auth.messageSigningAvailable).toBe(true);
        expect(auth.nativeSignInAvailable).toBe(false);

        let result!: WalletUiAuthResult;
        await act(async () => {
            result = await auth.signIn({ input });
        });

        expect(connectWallet).not.toHaveBeenCalled();
        expect(mockGetWalletAccountForUiWalletAccount).not.toHaveBeenCalled();
        expect(mockUseSignMessage).toHaveBeenCalledWith(account);
        expect(signMessage.signMessage).toHaveBeenCalledWith({
            message: createSignInMessage(expectedInput),
        });
        expect(result).toEqual({
            account,
            input: expectedInput,
            method: SolanaSignMessage,
            signature: signMessage.signature,
            signedMessage: createSignInMessage(expectedInput),
        });

        view.unmount();
    });

    it('falls back to wallet account message signing from the hook', async () => {
        const account = createTestAccount({ address: 'solflare-1', features: [SolanaSignMessage] });
        const standardAccount = createStandardAccount(account);
        const wallet = createTestWallet({
            accounts: [account],
            features: [SolanaSignMessage],
            name: 'Solflare',
        });
        const signMessage = createSignMessage();

        mockGetWalletAccountForUiWalletAccount.mockReturnValue(standardAccount);
        mockGetWalletAccountFeature.mockReturnValue({
            signMessage: signMessage.signMessage,
            version: '1.1.0',
        });
        mockUseWalletUi.mockReturnValue({ account, connect: jest.fn(), wallet, wallets: [wallet] });

        const view = renderAuthHook(wallet);
        const auth = view.getState();

        expect(auth.canSignIn).toBe(true);
        expect(auth.messageSigningAvailable).toBe(true);
        expect(auth.nativeSignInAvailable).toBe(false);

        let result!: WalletUiAuthResult;
        await act(async () => {
            result = await auth.signIn({
                input: {
                    domain: 'example.com',
                },
            });
        });

        expect(signMessage.signMessage).toHaveBeenCalledWith({
            account: standardAccount,
            message: createSignInMessage({
                address: 'solflare-1',
                domain: 'example.com',
            }),
        });
        expect(result.account).toBe(account);
        expect(result.method).toBe(SolanaSignMessage);

        view.unmount();
    });

    it('connects the wallet before message-signing fallback when no account is selected', async () => {
        const account = createTestAccount({ address: 'backpack-1', features: [SolanaSignMessage] });
        const standardAccount = createStandardAccount(account);
        const wallet = createTestWallet({
            accounts: [account],
            features: [StandardConnect, SolanaSignMessage],
            name: 'Backpack',
        });
        const connectWallet = jest.fn().mockResolvedValue([account]);
        const signMessage = createSignMessage();
        const walletUi = createWalletUiStore({ wallet });

        mockGetWalletAccountForUiWalletAccount.mockReturnValue(standardAccount);
        mockUseConnect.mockReturnValue([false, connectWallet]);
        mockGetWalletAccountFeature.mockReturnValue({
            signMessage: signMessage.signMessage,
            version: '1.1.0',
        });
        mockUseWalletUi.mockImplementation(walletUi.useWalletUi);

        const view = renderAuth(wallet);

        expect(view.getState().canSignIn).toBe(true);

        const settled: { current?: WalletUiAuthResult | 'pending' } = {};
        await act(async () => {
            const signInPromise = view.getState().signIn({
                input: {
                    domain: 'example.com',
                },
            });
            settled.current = await Promise.race([
                signInPromise,
                waitForNextMacrotask().then(() => 'pending' as const),
            ]);
        });

        expect(connectWallet).toHaveBeenCalled();
        expect(walletUi.getState().account).toBe(account);
        if (!settled.current || settled.current === 'pending') {
            throw new Error('Expected connect-before-sign fallback to settle');
        }
        expect(signMessage.signMessage).toHaveBeenCalled();
        expect(settled.current.account).toBe(account);
        expect(settled.current.method).toBe(SolanaSignMessage);

        view.unmount();
    });

    it('uses location host as the default message-signing domain', async () => {
        const originalLocation = globalThis.location;
        const account = createTestAccount({ address: 'solflare-1', features: [SolanaSignMessage] });
        const wallet = createTestWallet({
            accounts: [account],
            features: [StandardConnect, SolanaSignMessage],
            name: 'Solflare',
        });
        const signMessage = createSignMessageSigner();

        if (!originalLocation?.host) {
            Object.defineProperty(globalThis, 'location', {
                configurable: true,
                value: { host: 'example.com' },
            });
        }

        mockUseSignMessage.mockReturnValue(signMessage.signMessage);
        mockUseWalletUi.mockReturnValue({ account, connect: jest.fn(), wallet, wallets: [wallet] });

        const view = renderAuth(wallet);
        const domain = globalThis.location.host;

        try {
            let result!: WalletUiAuthResult;
            await act(async () => {
                result = await view.getState().signIn();
            });

            expect(result.input).toEqual({
                address: 'solflare-1',
                domain,
            });
            expect(signMessage.signMessage).toHaveBeenCalledWith({
                message: createSignInMessage({
                    address: 'solflare-1',
                    domain,
                }),
            });
        } finally {
            if (!originalLocation?.host) {
                Object.defineProperty(globalThis, 'location', {
                    configurable: true,
                    value: originalLocation,
                });
            }
        }

        view.unmount();
    });

    it('requires a domain for message-signing fallback', async () => {
        const account = createTestAccount({ address: 'solflare-1', features: [SolanaSignMessage] });
        const wallet = createTestWallet({
            accounts: [account],
            features: [StandardConnect, SolanaSignMessage],
            name: 'Solflare',
        });
        const signMessage = createSignMessageSigner();

        mockUseSignMessage.mockReturnValue(signMessage.signMessage);
        mockUseWalletUi.mockReturnValue({ account, connect: jest.fn(), wallet, wallets: [wallet] });

        const view = renderAuth(wallet);
        const error = await getSignInError(view.getState().signIn, { domain: '' });

        expect(error.reason).toBe('missing-domain');
        expect(signMessage.signMessage).not.toHaveBeenCalled();

        view.unmount();
    });

    it('reports unsupported auth from the headless hook', async () => {
        const account = createTestAccount({ address: 'wallet-1', features: [] });
        const wallet = createTestWallet({
            accounts: [account],
            features: [StandardConnect],
            name: 'Unsupported',
        });

        mockUseWalletUi.mockReturnValue({ account, connect: jest.fn(), wallet, wallets: [wallet] });

        const view = renderAuthHook(wallet);
        const auth = view.getState();
        const error = await getSignInError(auth.signIn, { domain: 'example.com' });

        expect(auth.canSignIn).toBe(false);
        expect(auth.reason).toBe('auth-unsupported');
        expect(error.reason).toBe('auth-unsupported');

        view.unmount();
    });

    it('reports wallet-not-connected from the headless hook when message signing needs an account', async () => {
        const wallet = createTestWallet({
            accounts: [],
            features: [SolanaSignMessage],
            name: 'Solflare',
        });

        mockUseWalletUi.mockReturnValue({
            account: undefined,
            connect: jest.fn(),
            wallet: undefined,
            wallets: [wallet],
        });

        const view = renderAuthHook(wallet);
        const auth = view.getState();
        const error = await getSignInError(auth.signIn, { domain: 'example.com' });

        expect(auth.canSignIn).toBe(false);
        expect(auth.reason).toBe('wallet-not-connected');
        expect(error.reason).toBe('wallet-not-connected');

        view.unmount();
    });

    it('reports disabled message auth as unavailable', async () => {
        const wallet = createTestWallet({
            accounts: [],
            features: [SolanaSignMessage],
            name: 'Solflare',
        });

        const view = renderMessageAuthHook({ account: undefined, enabled: true, wallet });
        const auth = view.getState();
        const error = await getSignInError(auth.signIn, { domain: 'example.com' });

        expect(auth.canSignIn).toBe(false);
        expect(auth.reason).toBe('wallet-not-connected');
        expect(error.reason).toBe('wallet-not-connected');

        view.unmount();
    });

    it('reports disabled native auth as unsupported', async () => {
        const wallet = createTestWallet({
            accounts: [],
            features: [SolanaSignIn],
            name: 'Phantom',
        });

        mockUseWalletUi.mockReturnValue({
            account: undefined,
            connect: jest.fn(),
            wallet: undefined,
            wallets: [wallet],
        });

        const view = renderNativeAuthHook({ enabled: false, wallet });
        const auth = view.getState();
        const error = await getSignInError(auth.signIn, { domain: 'example.com' });

        expect(auth.canSignIn).toBe(false);
        expect(auth.reason).toBe('auth-unsupported');
        expect(error.reason).toBe('auth-unsupported');

        view.unmount();
    });

    it('rejects when native sign-in returns no output', async () => {
        const wallet = createTestWallet({
            accounts: [],
            features: [SolanaSignIn],
            name: 'Phantom',
        });
        const nativeSignIn = jest.fn(() => Promise.resolve([]));

        mockGetWalletFeature.mockReturnValue({
            signIn: nativeSignIn,
            version: '1.0.0',
        });
        mockUseWalletUi.mockReturnValue({
            account: undefined,
            connect: jest.fn(),
            wallet: undefined,
            wallets: [wallet],
        });

        const view = renderAuth(wallet);
        const error = await getSignInError(view.getState().signIn, { domain: 'example.com' });

        expect(error.reason).toBe('auth-unsupported');

        view.unmount();
    });

    it('rejects when message signing returns no output', async () => {
        const account = createTestAccount({ address: 'solflare-1', features: [SolanaSignMessage] });
        const standardAccount = createStandardAccount(account);
        const wallet = createTestWallet({
            accounts: [account],
            features: [SolanaSignMessage],
            name: 'Solflare',
        });
        const signMessage = jest.fn(() => Promise.resolve([]));

        mockGetWalletAccountForUiWalletAccount.mockReturnValue(standardAccount);
        mockGetWalletAccountFeature.mockReturnValue({
            signMessage,
            version: '1.1.0',
        });
        mockUseWalletUi.mockReturnValue({ account, connect: jest.fn(), wallet, wallets: [wallet] });

        const view = renderAuthHook(wallet);
        const error = await getSignInError(view.getState().signIn, { domain: 'example.com' });

        expect(error.reason).toBe('message-signing-unavailable');

        view.unmount();
    });

    it('rejects when connect returns no account for message-signing fallback', async () => {
        const wallet = createTestWallet({
            accounts: [],
            features: [StandardConnect, SolanaSignMessage],
            name: 'Backpack',
        });
        const connectWallet = jest.fn().mockResolvedValue([]);
        const selectAccount = jest.fn();

        mockUseConnect.mockReturnValue([false, connectWallet]);
        mockUseWalletUi.mockReturnValue({
            account: undefined,
            connect: selectAccount,
            wallet: undefined,
            wallets: [wallet],
        });

        const view = renderAuth(wallet);
        const error = await getSignInError(view.getState().signIn, { domain: 'example.com' });

        expect(error.reason).toBe('wallet-not-connected');
        expect(selectAccount).not.toHaveBeenCalled();

        view.unmount();
    });

    it('rejects when a connected fallback account cannot sign messages', async () => {
        const account = createTestAccount({ address: 'backpack-1', features: [] });
        const wallet = createTestWallet({
            accounts: [account],
            features: [StandardConnect, SolanaSignMessage],
            name: 'Backpack',
        });
        const connectWallet = jest.fn().mockResolvedValue([account]);
        const selectAccount = jest.fn();

        mockUseConnect.mockReturnValue([false, connectWallet]);
        mockUseWalletUi.mockReturnValue({
            account: undefined,
            connect: selectAccount,
            wallet: undefined,
            wallets: [wallet],
        });

        const view = renderAuth(wallet);
        const error = await getSignInError(view.getState().signIn, { domain: 'example.com' });

        expect(error.reason).toBe('auth-unsupported');
        expect(selectAccount).not.toHaveBeenCalled();

        view.unmount();
    });

    it('reports unsupported auth when neither auth path is available', async () => {
        const account = createTestAccount({ address: 'wallet-1', features: [] });
        const wallet = createTestWallet({
            accounts: [account],
            features: [StandardConnect],
            name: 'Unsupported',
        });

        mockUseWalletUi.mockReturnValue({ account, connect: jest.fn(), wallet, wallets: [wallet] });

        const view = renderAuth(wallet);
        const auth = view.getState();
        const error = await getSignInError(auth.signIn, { domain: 'example.com' });

        expect(auth.canSignIn).toBe(false);
        expect(auth.reason).toBe('auth-unsupported');
        expect(error.reason).toBe('auth-unsupported');

        view.unmount();
    });
});

type TestUiWallet = UiWallet & {
    accounts: TestUiWalletAccount[];
};

type TestUiWalletAccount = UiWalletAccount & {
    wallet: TestUiWallet;
};

function createNativeSignIn(account: TestUiWalletAccount | WalletAccount) {
    const signedMessage = Uint8Array.from([1, 2, 3]);
    const signature = Uint8Array.from([4, 5, 6]);
    const signIn = jest.fn(() =>
        Promise.resolve([
            {
                account,
                signature,
                signedMessage,
            },
        ]),
    );

    return {
        signIn,
        signature,
        signedMessage,
    };
}

function createSignMessage() {
    const signature = Uint8Array.from([7, 8, 9]);
    const signMessage = jest.fn(({ message }: { account: WalletAccount; message: Uint8Array }) =>
        Promise.resolve([
            {
                signature,
                signedMessage: message,
            },
        ]),
    );

    return {
        signMessage,
        signature,
    };
}

function createSignMessageSigner() {
    const signature = Uint8Array.from([7, 8, 9]);
    const signMessage = jest.fn(({ message }: { message: Uint8Array }) =>
        Promise.resolve({
            signature,
            signedMessage: message,
        }),
    );

    return {
        signMessage,
        signature,
    };
}

function createStandardAccount(account: TestUiWalletAccount): WalletAccount {
    return {
        address: account.address,
        chains: account.chains,
        features: account.features,
        publicKey: account.publicKey,
    };
}

function createTestAccount({ address, features }: { address: string; features: string[] }): TestUiWalletAccount {
    return {
        address,
        chains: ['solana:devnet'],
        features,
        publicKey: Uint8Array.from([1, 2, 3]),
    } as unknown as TestUiWalletAccount;
}

function createTestWallet({
    accounts,
    features,
    name,
}: {
    accounts: TestUiWalletAccount[];
    features: string[];
    name: string;
}): TestUiWallet {
    const wallet = {
        accounts,
        chains: ['solana:devnet'],
        features,
        icon: 'data:image/png;base64,ZmFrZQ==',
        name,
        version: '1.0.0',
    } as unknown as TestUiWallet;

    for (const account of accounts) {
        account.wallet = wallet;
    }

    return wallet;
}

function createWalletUiStore({ wallet }: { wallet: TestUiWallet }) {
    const listeners = new Set<() => void>();
    let state: {
        account: TestUiWalletAccount | undefined;
        connect(account: TestUiWalletAccount): void;
        wallet: TestUiWallet | undefined;
        wallets: TestUiWallet[];
    };

    function emit() {
        for (const listener of listeners) {
            listener();
        }
    }

    function createState(account: TestUiWalletAccount | undefined) {
        return {
            account,
            connect: (account: TestUiWalletAccount) => {
                state = createState(account);
                emit();
            },
            wallet: account ? wallet : undefined,
            wallets: [wallet],
        };
    }

    state = createState(undefined);

    function getState() {
        return state;
    }

    return {
        getState,
        useWalletUi() {
            return React.useSyncExternalStore(
                listener => {
                    listeners.add(listener);
                    return () => {
                        listeners.delete(listener);
                    };
                },
                () => getState(),
                () => getState(),
            );
        },
    };
}

function renderAuth(wallet: UiWallet) {
    let auth: WalletUiAuthState | undefined;
    let renderer!: ReactTestRenderer;

    void act(() => {
        renderer = create(<WalletUiAuth wallet={wallet}>{nextAuth => ((auth = nextAuth), null)}</WalletUiAuth>);
    });

    return {
        getState() {
            if (!auth) {
                throw new Error('Missing auth state');
            }
            return auth;
        },
        unmount() {
            void act(() => {
                renderer.unmount();
            });
        },
    };
}

function renderAuthHook(wallet: UiWallet) {
    let auth: WalletUiAuthState | undefined;
    let renderer!: ReactTestRenderer;

    function TestHook() {
        auth = useWalletUiAuth({ wallet });
        return null;
    }

    void act(() => {
        renderer = create(<TestHook />);
    });

    return {
        getState() {
            if (!auth) {
                throw new Error('Missing auth state');
            }
            return auth;
        },
        unmount() {
            void act(() => {
                renderer.unmount();
            });
        },
    };
}

function renderMessageAuthHook(options: Parameters<typeof useWalletUiAuthMessage>[0]) {
    let auth: WalletUiAuthState | undefined;
    let renderer!: ReactTestRenderer;

    function TestHook() {
        auth = useWalletUiAuthMessage(options);
        return null;
    }

    void act(() => {
        renderer = create(<TestHook />);
    });

    return {
        getState() {
            if (!auth) {
                throw new Error('Missing auth state');
            }
            return auth;
        },
        unmount() {
            void act(() => {
                renderer.unmount();
            });
        },
    };
}

function renderNativeAuthHook(options: Parameters<typeof useWalletUiAuthNative>[0]) {
    let auth: WalletUiAuthState | undefined;
    let renderer!: ReactTestRenderer;

    function TestHook() {
        auth = useWalletUiAuthNative(options);
        return null;
    }

    void act(() => {
        renderer = create(<TestHook />);
    });

    return {
        getState() {
            if (!auth) {
                throw new Error('Missing auth state');
            }
            return auth;
        },
        unmount() {
            void act(() => {
                renderer.unmount();
            });
        },
    };
}

function waitForNextMacrotask() {
    return new Promise(resolve => {
        setTimeout(resolve, 0);
    });
}

async function getSignInError(
    signIn: (options?: { input?: SolanaSignInInput }) => Promise<WalletUiAuthResult>,
    input?: SolanaSignInInput,
) {
    let error: WalletUiAuthError | undefined;

    await act(async () => {
        try {
            await signIn(input ? { input } : undefined);
        } catch (e) {
            error = e as WalletUiAuthError;
        }
    });

    if (!(error instanceof WalletUiAuthError)) {
        throw new Error('Expected WalletUiAuthError');
    }

    return error;
}
