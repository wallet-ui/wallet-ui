import type { AppIdentity } from '@solana-mobile/mobile-wallet-adapter-protocol';
import type { ClientWithRpc, GetLatestBlockhashApi } from '@solana/kit';

import { createAuthorizationStore } from '../authorization-store';
import { mobileWallet } from '../mobile-wallet';
import {
    createAuthorizationResult,
    createCache,
    createExpectedAccount,
    createExpectedAuthorization,
    FIRST_ADDRESS,
    SECOND_ADDRESS,
    SECOND_ADDRESS_BASE64,
} from '../test-utils/fixtures';

const mockCreateTransactionPlanExecutor = vi.fn();
const mockDecodeBase58 = vi.fn();
const mockSignAndSendTransactionMessageWithSigners = vi.fn();
const mockTransact = vi.fn();

vi.mock('@solana-mobile/mobile-wallet-adapter-protocol-kit', () => ({
    transact: (...args: unknown[]) => mockTransact(...args),
}));

vi.mock('@solana/kit', () => ({
    createTransactionPlanExecutor: (...args: unknown[]) => mockCreateTransactionPlanExecutor(...args),
    extendClient: (client: object, additions: object) =>
        Object.defineProperties(
            Object.defineProperties({}, Object.getOwnPropertyDescriptors(client)),
            Object.getOwnPropertyDescriptors(additions),
        ),
    getAddressCodec: () => ({
        decode: () => FIRST_ADDRESS,
    }),
    getBase58Decoder: () => ({
        decode: (...args: unknown[]) => mockDecodeBase58(...args),
    }),
    getBase64Encoder: () => ({
        encode: (value: string) => value,
    }),
    pipe: (value: unknown, ...fns: Array<(input: unknown) => unknown>) => fns.reduce((input, fn) => fn(input), value),
    setTransactionMessageFeePayerSigner: (signer: unknown, transactionMessage: object) => ({
        ...transactionMessage,
        feePayerSigner: signer,
    }),
    setTransactionMessageLifetimeUsingBlockhash: (blockhash: unknown, transactionMessage: object) => ({
        ...transactionMessage,
        blockhash,
    }),
    signAndSendTransactionMessageWithSigners: (...args: unknown[]) =>
        mockSignAndSendTransactionMessageWithSigners(...args),
    signature: (value: string) => value,
}));

const CHAIN = 'solana:devnet';
const IDENTITY = {
    name: 'Wallet UI',
    uri: 'https://wallet-ui.dev',
} as AppIdentity;

describe('mobileWallet', () => {
    beforeEach(() => {
        mockCreateTransactionPlanExecutor.mockReset();
        mockDecodeBase58.mockReset();
        mockSignAndSendTransactionMessageWithSigners.mockReset();
        mockTransact.mockReset();

        mockCreateTransactionPlanExecutor.mockImplementation(({ executeTransactionMessage }) => {
            return async ({ message }: { message: object }) => {
                const context: Record<string, unknown> = {};
                const signature = await executeTransactionMessage(context, message);
                return {
                    context: { ...context, signature },
                    kind: 'single',
                    plannedMessage: message,
                    planType: 'transactionPlanResult',
                    status: 'successful',
                };
            };
        });
        mockDecodeBase58.mockReturnValue('encoded-signature');
    });

    it('requires an RPC capability', () => {
        const store = createAuthorizationStore({ cache: createCache() });

        expect(() => mobileWallet({ chain: CHAIN, identity: IDENTITY, store })({} as never)).toThrow(
            'An RPC instance is required on the client before using the mobile wallet plugin.',
        );
    });

    it('fails with an actionable error when no account is authorized', () => {
        const store = createAuthorizationStore({ cache: createCache() });
        const client = createPluginClient(store);

        expect(() => client.payer).toThrow('Call `connect()` before requesting the mobile wallet payer.');
    });

    it('connects and disconnects without React', async () => {
        expect.assertions(5);
        const store = createAuthorizationStore({ cache: createCache() });
        const wallet = {
            authorize: vi.fn().mockResolvedValue(createAuthorizationResult()),
        };
        mockTransact.mockImplementation(async callback => await callback(wallet));
        const client = createPluginClient(store);

        const account = await client.wallet.connect();

        expect(account.address).toBe(FIRST_ADDRESS);
        expect(client.payer.address).toBe(FIRST_ADDRESS);
        expect(store.$authToken.get()).toBe('next-auth-token');

        await client.wallet.disconnect();

        expect(store.$authToken.get()).toBeUndefined();
        expect(() => client.payer).toThrow('Call `connect()` before requesting the mobile wallet payer.');
    });

    it('resolves the current payer lazily and notifies payer subscribers', async () => {
        expect.assertions(4);
        const store = createAuthorizationStore({ cache: createCache() });
        const client = createPluginClient(store);
        const listener = vi.fn();
        const unsubscribe = client.subscribeToPayer(listener);

        await store.persist(createExpectedAuthorization());

        expect(listener).toHaveBeenCalledTimes(1);
        expect(client.payer.address).toBe(FIRST_ADDRESS);

        await store.persist(null);

        expect(listener).toHaveBeenCalledTimes(2);
        expect(() => client.payer).toThrow('Call `connect()` before requesting the mobile wallet payer.');
        unsubscribe();
    });

    it('returns a stable payer reference until the selected account changes', async () => {
        expect.assertions(3);
        const store = createAuthorizationStore({ cache: createCache() });
        await store.persist(createExpectedAuthorization());
        const client = createPluginClient(store);
        const payer = client.payer;

        expect(client.payer).toBe(payer);

        const secondAccount = createExpectedAccount({
            address: SECOND_ADDRESS,
            addressBase64: SECOND_ADDRESS_BASE64,
        });
        await store.persist(createExpectedAuthorization({ accounts: [secondAccount] }));

        expect(client.payer).not.toBe(payer);
        expect(client.payer.address).toBe(SECOND_ADDRESS);
    });

    it('authorizes and sends transaction plans through MWA', async () => {
        expect.assertions(8);
        const store = createAuthorizationStore({ cache: createCache() });
        await store.persist(createExpectedAuthorization());
        const signAndSendTransactions = vi.fn().mockResolvedValue([new Uint8Array([1, 2, 3])]);
        const wallet = {
            authorize: vi.fn().mockResolvedValue(createAuthorizationResult()),
            signAndSendTransactions,
        };
        mockTransact.mockImplementation(async callback => await callback(wallet));
        mockSignAndSendTransactionMessageWithSigners.mockImplementation(async transactionMessage => {
            const [signature] = await transactionMessage.feePayerSigner.signAndSendTransactions([transactionMessage]);
            return signature;
        });
        const client = createPluginClient(store);

        const result = await client.transactionPlanExecutor({ message: { id: 'planned-message' } } as never);

        expect(client.rpc.getLatestBlockhash).toHaveBeenCalledTimes(1);
        expect(wallet.authorize).toHaveBeenCalledWith({
            auth_token: 'cached-auth-token',
            chain: CHAIN,
            identity: IDENTITY,
        });
        expect(signAndSendTransactions).toHaveBeenCalledWith({
            minContextSlot: 42,
            transactions: [
                expect.objectContaining({
                    blockhash: expect.objectContaining({ blockhash: 'latest-blockhash' }),
                    feePayerSigner: expect.objectContaining({ address: FIRST_ADDRESS }),
                    id: 'planned-message',
                }),
            ],
        });
        expect(mockDecodeBase58).toHaveBeenCalledWith(new Uint8Array([1, 2, 3]));
        expect(result).toEqual(
            expect.objectContaining({
                context: expect.objectContaining({
                    message: expect.objectContaining({ id: 'planned-message' }),
                    signature: 'encoded-signature',
                }),
                status: 'successful',
            }),
        );
        expect(store.$authToken.get()).toBe('next-auth-token');
        expect(mockTransact).toHaveBeenCalledTimes(1);
        expect(mockSignAndSendTransactionMessageWithSigners).toHaveBeenCalledTimes(1);
    });
});

function createPluginClient(store: ReturnType<typeof createAuthorizationStore>) {
    const rpc = {
        getLatestBlockhash: vi.fn(() => ({
            send: vi.fn().mockResolvedValue({
                context: { slot: 42n },
                value: {
                    blockhash: 'latest-blockhash',
                    lastValidBlockHeight: 1n,
                },
            }),
        })),
    };
    return mobileWallet({ chain: CHAIN, identity: IDENTITY, store })({
        rpc,
    } as unknown as ClientWithRpc<GetLatestBlockhashApi>);
}
