import { AppIdentity } from '@solana-mobile/mobile-wallet-adapter-protocol';
import React, { type ReactNode, useContext } from 'react';

import { createAsyncStorageCache } from '../async-storage-cache';
import type { Cache } from '../cache';
import type { Client } from '../client';
import { createDefaultClient } from '../create-default-client';
import { MobileWalletProvider, MobileWalletProviderContext } from '../mobile-wallet-provider';
import { createCache } from '../test-utils/fixtures';
import { act, renderHook } from '../test-utils/react-test-renderer';
import type { WalletAuthorization } from '../use-authorization';

vi.mock('../async-storage-cache', () => ({
    createAsyncStorageCache: vi.fn(),
}));
vi.mock('../create-default-client', () => ({
    createDefaultClient: vi.fn(),
}));

const mockCreateAsyncStorageCache = vi.mocked(createAsyncStorageCache);
const mockCreateDefaultClient = vi.mocked(createDefaultClient);
const CLUSTER = {
    id: 'solana:devnet',
    url: 'https://rpc.wallet-ui.dev',
    urlWs: 'wss://rpc.wallet-ui.dev',
} as const;
const IDENTITY = {
    name: 'Wallet UI',
    uri: 'https://wallet-ui.dev',
} as AppIdentity;

describe('MobileWalletProvider', () => {
    beforeEach(() => {
        mockCreateAsyncStorageCache.mockReset();
        mockCreateDefaultClient.mockReset();
    });

    it('requires a client factory for explicit custom client types', () => {
        expectTypeOf<Parameters<typeof MobileWalletProvider<CustomClient>>[0]>().toMatchTypeOf<{
            createClient: (cluster: { url: string; urlWs?: string }) => CustomClient;
        }>();
        expectTypeOf<{
            children: ReactNode;
            cluster: typeof CLUSTER;
            identity: AppIdentity;
        }>().toMatchTypeOf<React.ComponentProps<typeof MobileWalletProvider>>();
    });

    it('uses the provided cache and client factory and fetches authorization on mount', async () => {
        expect.assertions(8);
        const cache = createCache();
        const client = createClient();
        const createClientFactory = vi.fn().mockReturnValue(client);
        const hook = renderHook(useProviderState, {
            initialProps: undefined,
            wrapper: createProviderWrapper({
                cache,
                createClient: createClientFactory,
            }),
        });

        await act(async () => {
            await Promise.resolve();
        });

        expect(createClientFactory).toHaveBeenCalledWith(CLUSTER);
        expect(mockCreateAsyncStorageCache).not.toHaveBeenCalled();
        expect(cache.get).toHaveBeenCalledTimes(1);
        expect(hook.result.cache).toBe(cache);
        expect(hook.result.chain).toBe(CLUSTER.id);
        expect(hook.result.client).toBe(client);
        expect(hook.result.identity).toBe(IDENTITY);
        expect(hook.result.store).toEqual(
            expect.objectContaining({ fetch: expect.any(Function), persist: expect.any(Function) }),
        );
    });

    it('creates a default cache when one is not provided', async () => {
        expect.assertions(6);
        const cache = createCache();
        const client = createClient();
        const createClientFactory = vi.fn().mockReturnValue(client);

        mockCreateAsyncStorageCache.mockReturnValue(cache as never);

        const hook = renderHook(useProviderState, {
            initialProps: undefined,
            wrapper: createProviderWrapper({
                createClient: createClientFactory,
            }),
        });

        await act(async () => {
            await Promise.resolve();
        });

        expect(mockCreateAsyncStorageCache).toHaveBeenCalledTimes(1);
        expect(createClientFactory).toHaveBeenCalledWith(CLUSTER);
        expect(cache.get).toHaveBeenCalledTimes(1);
        expect(hook.result.cache).toBe(cache);
        expect(hook.result.client).toBe(client);
        expect(hook.result.identity).toBe(IDENTITY);
    });

    it('creates a default client when a client factory is not provided', async () => {
        expect.assertions(2);
        const cache = createCache();
        const client = createClient();

        mockCreateDefaultClient.mockReturnValue(client);

        const hook = renderHook(useProviderState, {
            initialProps: undefined,
            wrapper: createProviderWrapper({ cache }),
        });

        await act(async () => {
            await Promise.resolve();
        });

        expect(mockCreateDefaultClient).toHaveBeenCalledWith(CLUSTER);
        expect(hook.result.client).toBe(client);
    });
});

type CustomClient = Client & {
    extraMethod: () => string;
};

function createClient(): Client {
    return {
        rpc: {
            getLatestBlockhash: vi.fn(),
        } as never,
        rpcSubscriptions: {} as never,
    };
}

function createProviderWrapper({
    cache,
    createClient,
}: {
    cache?: Cache<WalletAuthorization | undefined>;
    createClient?: (cluster: { url: string; urlWs?: string }) => Client;
}) {
    return function ProviderWrapper({ children }: { children: unknown }) {
        return (
            <MobileWalletProvider cache={cache} cluster={CLUSTER} createClient={createClient} identity={IDENTITY}>
                {children as ReactNode}
            </MobileWalletProvider>
        );
    };
}

function useProviderState(_: undefined) {
    return useContext(MobileWalletProviderContext);
}
