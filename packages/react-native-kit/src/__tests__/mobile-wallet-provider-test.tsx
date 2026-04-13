import { AppIdentity } from '@solana-mobile/mobile-wallet-adapter-protocol';
import React, { type ReactNode, useContext } from 'react';

import { act, renderHook } from '../test-utils/react-test-renderer';
import { createAsyncStorageCache } from '../async-storage-cache';
import type { Cache } from '../cache';
import type { Client } from '../client';
import { MobileWalletProvider, MobileWalletProviderContext } from '../mobile-wallet-provider';
import { createCache } from '../test-utils/fixtures';
import type { WalletAuthorization } from '../use-authorization';

jest.mock('../async-storage-cache', () => ({
    createAsyncStorageCache: jest.fn(),
}));

const mockCreateAsyncStorageCache = jest.mocked(createAsyncStorageCache);
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
    });

    it('uses the provided cache and client factory and fetches authorization on mount', async () => {
        expect.assertions(8);
        const cache = createCache();
        const client = createClient();
        const createClientFactory = jest.fn().mockReturnValue(client);
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
        expect(hook.result.store).toEqual(expect.objectContaining({ fetch: expect.any(Function), persist: expect.any(Function) }));
    });

    it('creates a default cache when one is not provided', async () => {
        expect.assertions(6);
        const cache = createCache();
        const client = createClient();
        const createClientFactory = jest.fn().mockReturnValue(client);

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
});

function createClient(): Client {
    return {
        rpc: {
            getLatestBlockhash: jest.fn(),
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
