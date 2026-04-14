/* global afterEach, beforeEach, describe, expect, it, jest */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MobileWalletProvider } from '@wallet-ui/react-native-kit';
import React from 'react';
import { act, create } from 'react-test-renderer';
import HomeScreen from '@/app/index';
import { AppConfig } from '@/constants/app-config';
import { NetworkProvider } from '@/features/network/network-provider';

const mockTransact = jest.fn();

jest.mock('@solana-mobile/mobile-wallet-adapter-protocol-kit', () => ({
    transact: (...args: unknown[]) => mockTransact(...args),
}), { virtual: true });

const FIRST_ADDRESS = '11111111111111111111111111111111';
const FIRST_ADDRESS_BASE64 = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
const SIGN_IN_RESULT = {
    signature: 'sign-in-signature',
    signed_message: 'sign-in-message',
};
const VALID_BLOCKHASH = '11111111111111111111111111111111';

describe('expo-kit app integration', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'log').mockImplementation(() => {});
        mockTransact.mockReset();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders, connects, signs in, signs messages, sends transactions, and disconnects', async () => {
        expect.assertions(15);

        const cache = createMemoryCache();
        const client = createMockClient();
        const wallet = createMockWallet({
            authorize: jest
                .fn()
                .mockResolvedValue(createAuthorizationResult())
                .mockResolvedValueOnce(createAuthorizationResult())
                .mockResolvedValueOnce(createAuthorizationResult({ sign_in_result: SIGN_IN_RESULT })),
        });
        const renderer = await renderHomeScreen({ cache, client, wallet });

        await waitForCondition(() => hasText(renderer, 'Version: 2.0.0 (123)'));

        expect(findButton(renderer, 'Connect')).toBeTruthy();
        expect(hasText(renderer, 'App Config')).toBe(true);
        expect(hasText(renderer, 'Connected to Devnet')).toBe(true);
        expect(hasText(renderer, 'Version: 2.0.0 (123)')).toBe(true);

        await pressButton(renderer, 'Connect');
        await waitForCondition(() => hasText(renderer, 'Connected to Primary'));

        expect(hasText(renderer, 'Connected to Primary')).toBe(true);
        expect(wallet.authorize).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                auth_token: undefined,
                chain: 'solana:devnet',
                identity: AppConfig.identity,
            }),
        );

        await pressButton(renderer, 'Sign In with Primary');
        await waitForCondition(() => wallet.authorize.mock.calls.length === 2);

        expect(wallet.authorize).toHaveBeenCalledTimes(2);
        expect(wallet.authorize).toHaveBeenNthCalledWith(2, {
            auth_token: 'auth-token',
            chain: 'solana:devnet',
            identity: AppConfig.identity,
            sign_in_payload: {
                address: FIRST_ADDRESS,
                chainId: 'solana:devnet',
                uri: AppConfig.identity.uri,
            },
        });

        await pressButton(renderer, 'Sign Message');
        await waitForCondition(() => hasButton(renderer, 'Message Signed!'));

        expect(findButton(renderer, 'Message Signed!')).toBeTruthy();
        expect(wallet.signMessages).toHaveBeenCalledWith({
            addresses: [FIRST_ADDRESS_BASE64],
            payloads: [new TextEncoder().encode(`Signing a message with ${FIRST_ADDRESS}`)],
        });

        await pressButton(renderer, 'Send Multiple Transactions');
        await waitForCondition(() => hasButton(renderer, '2 Transactions Sent!'));

        expect(findButton(renderer, '2 Transactions Sent!')).toBeTruthy();
        expect(wallet.signAndSendTransactions).toHaveBeenCalledWith(
            expect.objectContaining({
                minContextSlot: 42,
                transactions: expect.any(Array),
            }),
        );

        await pressButton(renderer, 'Disconnect');
        await waitForCondition(() => hasButton(renderer, 'Connect') && !hasText(renderer, 'Connected to Primary'));

        expect(findButton(renderer, 'Connect')).toBeTruthy();
        expect(hasText(renderer, 'Connected to Primary')).toBe(false);
        expect(cache.clear).toHaveBeenCalledTimes(1);
    });

    it('rehydrates a cached connection after remount without reauthorizing', async () => {
        expect.assertions(5);

        const cache = createMemoryCache();
        const client = createMockClient();
        const wallet = createMockWallet();
        let renderer = await renderHomeScreen({ cache, client, wallet });

        await pressButton(renderer, 'Connect');
        await waitForCondition(() => hasText(renderer, 'Connected to Primary'));

        expect(wallet.authorize).toHaveBeenCalledTimes(1);

        await unmountRenderer(renderer);

        renderer = await renderHomeScreen({ cache, client, wallet });
        await waitForCondition(() => hasText(renderer, 'Connected to Primary'));

        expect(cache.get).toHaveBeenCalledTimes(2);
        expect(hasButton(renderer, 'Disconnect')).toBe(true);
        expect(hasText(renderer, 'Connected to Primary')).toBe(true);
        expect(wallet.authorize).toHaveBeenCalledTimes(1);
    });

    it('shows a user-visible failure when signing messages fails', async () => {
        expect.assertions(1);

        const cache = createMemoryCache();
        const client = createMockClient();
        const wallet = createMockWallet({
            signMessages: jest.fn().mockRejectedValue(new Error('boom')),
        });
        const renderer = await renderHomeScreen({ cache, client, wallet });

        await pressButton(renderer, 'Connect');
        await waitForCondition(() => hasButton(renderer, 'Sign Message'));

        await pressButton(renderer, 'Sign Message');
        await waitForCondition(() => hasButton(renderer, 'Sign Message Failed'));

        expect(findButton(renderer, 'Sign Message Failed')).toBeTruthy();
    });
});

function createMemoryCache(initialValue?: unknown) {
    let value = initialValue;

    return {
        clear: jest.fn(async () => {
            value = undefined;
        }),
        get: jest.fn(async () => value),
        set: jest.fn(async nextValue => {
            value = nextValue;
        }),
    };
}

function createAuthorizationResult(overrides = {}) {
    return {
        accounts: [
            {
                address: FIRST_ADDRESS_BASE64,
                label: 'Primary',
            },
        ],
        auth_token: 'auth-token',
        wallet_uri_base: 'https://wallet.example',
        ...overrides,
    };
}

function createMockClient() {
    return {
        rpc: {
            getBalance: jest.fn(() => ({
                send: jest.fn().mockResolvedValue({
                    value: 2_000_000_000n,
                }),
            })),
            getGenesisHash: jest.fn(() => ({
                send: jest.fn().mockResolvedValue('GenesisHash11111111'),
            })),
            getLatestBlockhash: jest.fn(() => ({
                send: jest.fn().mockResolvedValue({
                    context: {
                        slot: 42n,
                    },
                    value: {
                        blockhash: VALID_BLOCKHASH,
                        lastValidBlockHeight: 123n,
                    },
                }),
            })),
            getVersion: jest.fn(() => ({
                send: jest.fn().mockResolvedValue({
                    'feature-set': 123,
                    'solana-core': '2.0.0',
                }),
            })),
        },
        rpcSubscriptions: {},
    };
}

function createMockWallet({
    authorize = jest.fn().mockResolvedValue(createAuthorizationResult()),
    signAndSendTransactions = jest
        .fn()
        .mockResolvedValue([Uint8Array.from([1, 2, 3]), Uint8Array.from([4, 5, 6])]),
    signMessages = jest.fn().mockResolvedValue([Uint8Array.from([7, 8, 9])]),
    signTransactions = jest.fn().mockResolvedValue([{}]),
}: {
    authorize?: jest.Mock;
    signAndSendTransactions?: jest.Mock;
    signMessages?: jest.Mock;
    signTransactions?: jest.Mock;
} = {}) {
    return {
        authorize,
        signAndSendTransactions,
        signMessages,
        signTransactions,
    };
}

async function pressButton(renderer: any, title: string) {
    await act(async () => {
        const button = findButton(renderer, title);

        if (button.props.disabled || button.props.accessibilityState?.disabled) {
            throw new Error(`Button is disabled: ${title}`);
        }

        button.props.onPress();
        await settle();
    });
}

async function unmountRenderer(renderer: any) {
    await act(async () => {
        renderer.unmount();
        await settle();
    });
}

async function renderHomeScreen({
    cache,
    client,
    wallet,
}: {
    cache: ReturnType<typeof createMemoryCache>;
    client: ReturnType<typeof createMockClient>;
    wallet: ReturnType<typeof createMockWallet>;
}) {
    mockTransact.mockImplementation(async callback => await callback(wallet));

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    let renderer: any;

    await act(async () => {
        renderer = create(
            <QueryClientProvider client={queryClient}>
                <NetworkProvider
                    networks={AppConfig.networks}
                    render={({ selectedNetwork }) => (
                        <MobileWalletProvider
                            cache={cache}
                            cluster={selectedNetwork}
                            createClient={() => client}
                            identity={AppConfig.identity}
                        >
                            <HomeScreen />
                        </MobileWalletProvider>
                    )}
                />
            </QueryClientProvider>,
        );
        await settle();
    });

    return renderer;
}

function findButton(renderer: any, title: string) {
    const button = renderer.root.findAll(
        node => typeof node.type === 'string' && node.type === 'Button' && node.props.title === title,
    )[0];

    if (!button) {
        throw new Error(`Button not found: ${title}`);
    }

    return button;
}

function hasButton(renderer: any, title: string) {
    return renderer.root.findAll(
        node => typeof node.type === 'string' && node.type === 'Button' && node.props.title === title,
    ).length > 0;
}

function getNodeText(node: any): string {
    return node.children
        .map(child => {
            if (typeof child === 'string') {
                return child;
            }
            return getNodeText(child);
        })
        .join('');
}

function hasText(renderer: any, expected: string) {
    return renderer.root.findAll(node => typeof node.type === 'string' && getNodeText(node) === expected).length > 0;
}

async function settle() {
    await Promise.resolve();
    await new Promise(resolve => setTimeout(resolve, 0));
}

async function waitForCondition(condition: () => boolean, timeoutMs = 2_000) {
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
        if (condition()) {
            return;
        }

        await act(async () => {
            await settle();
        });
    }

    throw new Error('Timed out waiting for test condition');
}
