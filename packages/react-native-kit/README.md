[![npm][npm-image]][npm-url]
[![npm-downloads][npm-downloads-image]][npm-url]

[npm-downloads-image]: https://img.shields.io/npm/dm/@wallet-ui/react-native-kit/latest.svg?style=flat
[npm-image]: https://img.shields.io/npm/v/@wallet-ui/react-native-kit/latest.svg?style=flat
[npm-url]: https://www.npmjs.com/package/@wallet-ui/react-native-kit/v/latest

# @wallet-ui/react-native-kit

This package provides Wallet UI's React Native hooks and Mobile Wallet Adapter integration for Solana apps.

## Mobile Wallet Adapter Kit plugin

`mobileWallet()` adds three capabilities to a Kit 7 client:

- A lazy `payer` backed by the currently selected Mobile Wallet Adapter account.
- A `transactionPlanExecutor` that submits through the wallet's `signAndSendTransactions` method.
- Headless `client.wallet.connect()` and `client.wallet.disconnect()` actions.

Install the Kit plugins used to build the client:

```sh
pnpm add @solana/kit@^7 @solana/kit-plugin-instruction-plan @solana/kit-plugin-rpc @wallet-ui/react-native-kit
```

Compose the granular plugins in capability order:

```ts
import { createClient } from '@solana/kit';
import { planAndSendTransactions } from '@solana/kit-plugin-instruction-plan';
import { rpcTransactionPlanner, solanaRpcConnection } from '@solana/kit-plugin-rpc';
import { mobileWallet, type MobileWalletConfig } from '@wallet-ui/react-native-kit';

function createMobileClient(cluster: { url: string; urlWs?: string }, mobileWalletConfig: MobileWalletConfig) {
    return createClient()
        .use(
            solanaRpcConnection({
                rpcSubscriptionsUrl: cluster.urlWs,
                rpcUrl: cluster.url,
            }),
        )
        .use(mobileWallet(mobileWalletConfig))
        .use(rpcTransactionPlanner({ estimateResourceLimits: false }))
        .use(planAndSendTransactions());
}

export type MobileClient = ReturnType<typeof createMobileClient>;
```

The order reflects each plugin's required capabilities. `solanaRpcConnection()` provides RPC, `mobileWallet()` adds the payer and MWA executor, `rpcTransactionPlanner()` consumes the payer, and `planAndSendTransactions()` consumes the planner and executor.

Use the granular RPC plugins instead of `solanaRpc()`. The preset installs an RPC transaction executor, which would replace the MWA executor and submit transactions through RPC.

### React provider

`MobileWalletProvider` passes its authorization store, chain, and identity to the client factory as the second argument:

```tsx
import type { Instruction } from '@solana/kit';
import { MobileWalletProvider, useMobileWallet } from '@wallet-ui/react-native-kit';
import type { ReactNode } from 'react';
import { Button } from 'react-native';

const cluster = {
    id: 'solana:devnet',
    url: 'https://api.devnet.solana.com',
} as const;
const identity = {
    name: 'My app',
    uri: 'https://example.com',
};

export function Providers({ children }: { children: ReactNode }) {
    return (
        <MobileWalletProvider<MobileClient> cluster={cluster} createClient={createMobileClient} identity={identity}>
            {children}
        </MobileWalletProvider>
    );
}

export function SendButton({ instruction }: { instruction: Instruction }) {
    const { client, connect } = useMobileWallet<MobileClient>();

    return (
        <Button
            onPress={async () => {
                await connect();
                await client.sendTransaction([instruction]);
            }}
            title="Send"
        />
    );
}
```

### Headless client

The same plugin works without React. Create and hydrate an authorization store, connect, then use the standard Kit send methods:

```ts
import { type Cache, createAuthorizationStore, type WalletAuthorization } from '@wallet-ui/react-native-kit';

// Any `Cache` implementation works. Back it with persistent storage so sessions survive app restarts.
let cached: WalletAuthorization | undefined;
const cache: Cache<WalletAuthorization | undefined> = {
    async clear() {
        cached = undefined;
    },
    async get() {
        return cached;
    },
    async set(value) {
        cached = value;
    },
};

const store = createAuthorizationStore({ cache });
await store.fetch();

const client = createMobileClient(cluster, {
    chain: cluster.id,
    identity,
    store,
});

await client.wallet.connect();
await client.sendTransaction([instruction]);
await client.wallet.disconnect();
```

Reading `client.payer` before a session is authorized throws an error that directs the caller to connect first. The payer tracks the authorization store's selected account, so account changes do not require rebuilding the client. Repeated reads return the same signer reference until the selected account changes, which keeps `subscribeToPayer` and `payer` usable together as a `useSyncExternalStore` subscription.
