import type { AppIdentity } from '@solana-mobile/mobile-wallet-adapter-protocol';
import { getAddMemoInstruction } from '@solana-program/memo';
import { createClient, getBase58Decoder } from '@solana/kit';
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
        const rpcResponse = {
            id: '1',
            jsonrpc: '2.0',
            result: {
                context: { slot: 42 },
                value: { blockhash: BLOCKHASH, lastValidBlockHeight: 123 },
            },
        };
        const fetch = vi.fn().mockResolvedValue({
            json: async () => rpcResponse,
            ok: true,
            text: async () => JSON.stringify(rpcResponse),
        });
        vi.stubGlobal('fetch', fetch);

        const client = createClient()
            .use(
                solanaRpcConnection({
                    rpcSubscriptionsUrl: 'wss://rpc.example.com',
                    rpcUrl: 'https://rpc.example.com',
                }),
            )
            .use(mobileWallet({ chain: CHAIN, identity: IDENTITY, store }))
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
});
