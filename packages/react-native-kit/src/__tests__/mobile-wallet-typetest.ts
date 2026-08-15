import { createClient } from '@solana/kit';
import { planAndSendTransactions } from '@solana/kit-plugin-instruction-plan';
import { rpcTransactionPlanner, solanaRpcConnection } from '@solana/kit-plugin-rpc';

import { createAuthorizationStore } from '../authorization-store';
import type { BaseClient } from '../client';
import { mobileWallet } from '../mobile-wallet';
import { createCache } from '../test-utils/fixtures';

describe('mobileWallet types', () => {
    it('composes with the granular Kit RPC plugins', () => {
        const client = createClient()
            .use(solanaRpcConnection({ rpcUrl: 'https://api.devnet.solana.com' }))
            .use(
                mobileWallet({
                    chain: 'solana:devnet',
                    identity: { name: 'Wallet UI', uri: 'https://wallet-ui.dev' },
                    store: createAuthorizationStore({ cache: createCache() }),
                }),
            )
            .use(rpcTransactionPlanner({ estimateResourceLimits: false }))
            .use(planAndSendTransactions());

        expectTypeOf(client).toMatchTypeOf<BaseClient>();
        expectTypeOf(client.payer.signAndSendTransactions).toBeFunction();
        expectTypeOf(client.sendTransaction).toBeFunction();
        expectTypeOf(client.sendTransactions).toBeFunction();
        expectTypeOf(client.subscribeToPayer).toBeFunction();
        expectTypeOf(client.wallet.connect).toBeFunction();
        expectTypeOf(client.wallet.disconnect).toBeFunction();
    });
});
