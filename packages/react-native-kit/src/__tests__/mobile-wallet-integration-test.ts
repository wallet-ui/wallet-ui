import type { AppIdentity } from '@solana-mobile/mobile-wallet-adapter-protocol';
import { getAddMemoInstruction } from '@solana-program/memo';
import {
    createClient,
    getBase58Decoder,
    getCompiledTransactionMessageDecoder,
    getU32Decoder,
    type ReadonlyUint8Array,
    type Transaction,
} from '@solana/kit';
import { planAndSendTransactions } from '@solana/kit-plugin-instruction-plan';
import { rpcTransactionPlanner, solanaRpcConnection } from '@solana/kit-plugin-rpc';

import { createAuthorizationStore } from '../authorization-store';
import { mobileWallet } from '../mobile-wallet';
import {
    createAuthorizationResult,
    createCache,
    createExpectedAuthorization,
    FIRST_ADDRESS,
} from '../test-utils/fixtures';

const mockTransact = vi.fn();

vi.mock('@solana-mobile/mobile-wallet-adapter-protocol-kit', () => ({
    transact: (...args: unknown[]) => mockTransact(...args),
}));

const BLOCKHASH = '11111111111111111111111111111111';
const CHAIN = 'solana:devnet';
const IDENTITY = {
    name: 'Wallet UI',
    uri: 'https://wallet-ui.dev',
} as AppIdentity;
const SIGNATURE_BYTES = new Uint8Array(64);
/** ComputeBudget program instruction discriminator for `SetComputeUnitLimit`. */
const SET_COMPUTE_UNIT_LIMIT_DISCRIMINATOR = 2;

describe('mobileWallet integration', () => {
    beforeEach(() => {
        mockTransact.mockReset();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('plans with the real Kit plugins and submits the compiled transaction through MWA', async () => {
        expect.assertions(8);
        const store = createAuthorizationStore({ cache: createCache() });
        const signAndSendTransactions = vi.fn().mockResolvedValue([SIGNATURE_BYTES]);
        const wallet = {
            authorize: vi.fn().mockResolvedValue(createAuthorizationResult()),
            signAndSendTransactions,
        };
        mockTransact.mockImplementation(async callback => await callback(wallet));
        const fetch = createRpcFetch();
        vi.stubGlobal('fetch', fetch);

        const client = createClient()
            .use(
                solanaRpcConnection({
                    rpcSubscriptionsUrl: 'wss://rpc.example.com',
                    rpcUrl: 'https://rpc.example.com',
                }),
            )
            .use(mobileWallet({ chain: CHAIN, estimateResourceLimits: false, identity: IDENTITY, store }))
            .use(rpcTransactionPlanner({ estimateResourceLimits: false }))
            .use(planAndSendTransactions());
        await store.persist(createExpectedAuthorization());

        const result = await client.sendTransaction([getAddMemoInstruction({ memo: 'Wallet UI' })]);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(wallet.authorize).toHaveBeenCalledWith({
            auth_token: 'cached-auth-token',
            chain: CHAIN,
            identity: IDENTITY,
        });
        expect(signAndSendTransactions).toHaveBeenCalledWith({
            minContextSlot: 42,
            transactions: [expect.objectContaining({ messageBytes: expect.any(Uint8Array) })],
        });
        expect(result.status).toBe('successful');
        expect(result.context.signature).toBe(getBase58Decoder().decode(SIGNATURE_BYTES));
        expect(store.$authToken.get()).toBe('next-auth-token');
        expect(mockTransact).toHaveBeenCalledTimes(1);
        expect(client.payer.address).toBe(FIRST_ADDRESS);
    });

    it('simulates each planned transaction to set its compute unit limit before signing', async () => {
        expect.assertions(4);
        const store = createAuthorizationStore({ cache: createCache() });
        const signAndSendTransactions = vi.fn().mockResolvedValue([SIGNATURE_BYTES]);
        mockTransact.mockImplementation(
            async callback =>
                await callback({
                    authorize: vi.fn().mockResolvedValue(createAuthorizationResult()),
                    signAndSendTransactions,
                }),
        );
        const fetch = createRpcFetch({ unitsConsumed: 1_000 });
        vi.stubGlobal('fetch', fetch);

        const client = createClient()
            .use(
                solanaRpcConnection({
                    rpcSubscriptionsUrl: 'wss://rpc.example.com',
                    rpcUrl: 'https://rpc.example.com',
                }),
            )
            .use(mobileWallet({ chain: CHAIN, identity: IDENTITY, store }))
            .use(rpcTransactionPlanner())
            .use(planAndSendTransactions());
        await store.persist(createExpectedAuthorization());

        const result = await client.sendTransaction([getAddMemoInstruction({ memo: 'Wallet UI' })]);

        expect(result.status).toBe('successful');
        expect(fetch.mock.calls.map(([, init]) => getRpcMethod(init))).toEqual([
            'getLatestBlockhash',
            'simulateTransaction',
        ]);
        const [{ transactions }] = signAndSendTransactions.mock.calls[0] as [{ transactions: Transaction[] }];
        expect(transactions).toHaveLength(1);
        // The 1,000 CU estimate gets the minimum 300 CU buffer.
        expect(getComputeUnitLimit(transactions[0])).toBe(1_300);
    });
});

function createRpcFetch({ unitsConsumed = 0 }: { unitsConsumed?: number } = {}) {
    return vi.fn(async (_url: string, init: RequestInit) => {
        const method = getRpcMethod(init);
        const result =
            method === 'simulateTransaction'
                ? {
                      context: { slot: 42 },
                      value: {
                          accounts: null,
                          err: null,
                          innerInstructions: null,
                          logs: [],
                          replacementBlockhash: null,
                          returnData: null,
                          unitsConsumed,
                      },
                  }
                : {
                      context: { slot: 42 },
                      value: { blockhash: BLOCKHASH, lastValidBlockHeight: 123 },
                  };
        const rpcResponse = { id: '1', jsonrpc: '2.0', result };
        return {
            json: async () => rpcResponse,
            ok: true,
            text: async () => JSON.stringify(rpcResponse),
        };
    });
}

function getRpcMethod(init: RequestInit): string {
    return (JSON.parse(init.body as string) as { method: string }).method;
}

function getComputeUnitLimit(transaction: Transaction): number | undefined {
    const message = getCompiledTransactionMessageDecoder().decode(transaction.messageBytes);
    if (!('instructions' in message)) {
        return undefined;
    }
    const instruction = message.instructions.find(
        ({ data }: { data?: ReadonlyUint8Array }) =>
            data?.[0] === SET_COMPUTE_UNIT_LIMIT_DISCRIMINATOR && data.length === 5,
    );
    return instruction?.data ? getU32Decoder().decode(instruction.data, 1) : undefined;
}
