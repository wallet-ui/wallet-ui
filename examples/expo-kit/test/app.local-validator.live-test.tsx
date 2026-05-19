/* global afterEach, beforeEach, describe, expect, it, jest */

import {
    airdropFactory,
    generateKeyPairSigner,
    getAddressEncoder,
    sendAndConfirmTransactionFactory,
    signTransaction,
} from '@solana/kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MobileWalletProvider, createDefaultClient, createSolanaLocalnet } from '@wallet-ui/react-native-kit';
import React from 'react';
import { act, create } from 'react-test-renderer';
import HomeScreen from '@/app/index';
import { AppConfig } from '@/constants/app-config';
import { NetworkProvider } from '@/features/network/network-provider';

const mockTransact = jest.fn();

jest.mock(
    '@solana-mobile/mobile-wallet-adapter-protocol-kit',
    () => ({
        transact: (...args: unknown[]) => mockTransact(...args),
    }),
    { virtual: true },
);

const AIRDROP_LAMPORTS = 2_000_000_000n;
const LOCALNET = createSolanaLocalnet({ url: 'http://127.0.0.1:8899' });
const SIGN_IN_RESULT = {
    signature: 'sign-in-signature',
    signed_message: 'sign-in-message',
};
const TEST_AUTH_TOKEN = 'local-validator-auth-token';
const TEST_WALLET_LABEL = 'Local Validator Wallet';

describe('expo-kit local validator integration', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'log').mockImplementation(() => {});
        mockTransact.mockReset();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('runs the app account operations through a funded local validator wallet', async () => {
        const client = createDefaultClient(LOCALNET);
        const signer = await generateKeyPairSigner();
        const wallet = createLocalValidatorWallet({ client, signer });
        await fundLocalValidatorWallet({ client, signer });

        const renderer = await renderHomeScreen({ client, wallet });

        await waitForCondition(() => hasText(renderer, 'Connected to Localnet'));

        expect(hasText(renderer, 'Connected to Localnet')).toBe(true);

        await pressButton(renderer, 'Connect');
        await waitForCondition(() => hasText(renderer, `Connected to ${TEST_WALLET_LABEL}`));
        await waitForCondition(() => hasText(renderer, 'Balance: 2 SOL'));

        expect(wallet.authorize).toHaveBeenCalledWith(
            expect.objectContaining({
                auth_token: undefined,
                chain: 'solana:localnet',
                identity: AppConfig.identity,
            }),
        );

        await pressButton(renderer, `Sign In with ${TEST_WALLET_LABEL}`);
        await waitForCondition(() => wallet.authorize.mock.calls.length === 2);

        expect(wallet.authorize).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                auth_token: TEST_AUTH_TOKEN,
                chain: 'solana:localnet',
                sign_in_payload: {
                    address: signer.address,
                    chainId: 'solana:localnet',
                    uri: AppConfig.identity.uri,
                },
            }),
        );

        await pressButton(renderer, 'Sign Message');
        await waitForCondition(() => hasButton(renderer, 'Message Signed!'));

        expect(wallet.signMessages).toHaveBeenCalledWith(
            expect.objectContaining({
                addresses: expect.any(Array),
                payloads: [new TextEncoder().encode(`Signing a message with ${signer.address}`)],
            }),
        );

        await pressButton(renderer, 'Sign Multiple Messages');
        await waitForCondition(() => hasButton(renderer, '2 Messages Signed!'));

        expect(wallet.signMessages).toHaveBeenCalledTimes(2);
        expect(wallet.signMessages).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                addresses: expect.any(Array),
                payloads: expect.arrayContaining([
                    new TextEncoder().encode(`Message 1 from ${signer.address}`),
                    new TextEncoder().encode(`Message 2 from ${signer.address}`),
                ]),
            }),
        );

        await pressButton(renderer, 'Sign transaction');
        await waitForCondition(() => wallet.signTransactions.mock.calls.length === 1);

        expect(wallet.signTransactions).toHaveBeenCalledWith(
            expect.objectContaining({
                transactions: expect.any(Array),
            }),
        );

        await pressButton(renderer, 'Send transaction');
        await waitForCondition(() => wallet.signAndSendTransactions.mock.calls.length === 1);

        expect(wallet.signAndSendTransactions).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                minContextSlot: expect.any(Number),
                transactions: expect.any(Array),
            }),
        );

        await pressButton(renderer, 'Send Multiple Transactions');
        await waitForCondition(() => hasButton(renderer, '2 Transactions Sent!'));

        expect(findButton(renderer, '2 Transactions Sent!')).toBeTruthy();
        expect(wallet.signAndSendTransactions).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                minContextSlot: expect.any(Number),
                transactions: expect.any(Array),
            }),
        );

        await pressButton(renderer, 'Disconnect');
        await waitForCondition(
            () => hasButton(renderer, 'Connect') && !hasText(renderer, `Connected to ${TEST_WALLET_LABEL}`),
        );

        expect(findButton(renderer, 'Connect')).toBeTruthy();
    });
});

async function fundLocalValidatorWallet({
    client,
    signer,
}: {
    client: ReturnType<typeof createDefaultClient>;
    signer: Awaited<ReturnType<typeof generateKeyPairSigner>>;
}) {
    await airdropFactory(client)({
        commitment: 'confirmed',
        lamports: AIRDROP_LAMPORTS,
        recipientAddress: signer.address,
    });
}

function createLocalValidatorWallet({
    client,
    signer,
}: {
    client: ReturnType<typeof createDefaultClient>;
    signer: Awaited<ReturnType<typeof generateKeyPairSigner>>;
}) {
    const addressBase64 = Buffer.from(getAddressEncoder().encode(signer.address)).toString('base64');
    const sendAndConfirmTransaction = sendAndConfirmTransactionFactory(client);
    const authorizationResult = {
        accounts: [
            {
                address: addressBase64,
                label: TEST_WALLET_LABEL,
            },
        ],
        auth_token: TEST_AUTH_TOKEN,
    };

    return {
        authorize: jest.fn(async ({ sign_in_payload }) => ({
            ...authorizationResult,
            ...(sign_in_payload ? { sign_in_result: SIGN_IN_RESULT } : {}),
        })),
        signAndSendTransactions: jest.fn(async ({ minContextSlot, transactions }) => {
            return await Promise.all(
                transactions.map(async transaction => {
                    const signedTransaction = await signTransaction([signer.keyPair], transaction);

                    await sendAndConfirmTransaction(signedTransaction, {
                        commitment: 'confirmed',
                        minContextSlot,
                    });

                    const signature = Object.values(signedTransaction.signatures)[0];

                    if (!signature) {
                        throw new Error('Expected signed transaction to contain a signature');
                    }

                    return signature;
                }),
            );
        }),
        signMessages: jest.fn(async ({ payloads }) => payloads),
        signTransactions: jest.fn(async ({ transactions }) => transactions),
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

async function renderHomeScreen({
    client,
    wallet,
}: {
    client: ReturnType<typeof createDefaultClient>;
    wallet: ReturnType<typeof createLocalValidatorWallet>;
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
                    networks={[LOCALNET]}
                    render={({ selectedNetwork }) => (
                        <MobileWalletProvider
                            cache={createMemoryCache()}
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

function findButton(renderer: any, title: string) {
    const button = renderer.root.findAll(
        node => typeof node.type === 'string' && node.type === 'Button' && node.props.title === title,
    )[0];

    if (!button) {
        throw new Error(`Button not found: ${title}`);
    }

    return button;
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

function hasButton(renderer: any, title: string) {
    return (
        renderer.root.findAll(
            node => typeof node.type === 'string' && node.type === 'Button' && node.props.title === title,
        ).length > 0
    );
}

function hasText(renderer: any, expected: string) {
    return renderer.root.findAll(node => typeof node.type === 'string' && getNodeText(node) === expected).length > 0;
}

async function settle() {
    await Promise.resolve();
    await new Promise(resolve => setTimeout(resolve, 0));
}

async function waitForCondition(condition: () => boolean, timeoutMs = 10_000) {
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
        if (condition()) {
            return;
        }
        await settle();
    }

    throw new Error('Timed out waiting for condition');
}
