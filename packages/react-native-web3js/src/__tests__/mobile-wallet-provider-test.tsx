import { Connection } from '@solana/web3.js';
import { AppIdentity, Chain } from '@solana-mobile/mobile-wallet-adapter-protocol';
import React, { type ReactNode, useContext } from 'react';

import { act, renderHook } from '../test-utils/react-test-renderer';
import { createAsyncStorageCache } from '../async-storage-cache';
import type { Cache } from '../cache';
import { MobileWalletProvider, MobileWalletProviderContext } from '../mobile-wallet-provider';
import { createCache } from '../test-utils/fixtures';
import type { WalletAuthorization } from '../use-authorization';

jest.mock('../async-storage-cache', () => ({
    createAsyncStorageCache: jest.fn(),
}));

const mockCreateAsyncStorageCache = jest.mocked(createAsyncStorageCache);
const CHAIN = 'solana:devnet' as Chain;
const ENDPOINT = 'https://rpc.wallet-ui.dev';
const IDENTITY = {
    name: 'Wallet UI',
    uri: 'https://wallet-ui.dev',
} as AppIdentity;

describe('MobileWalletProvider', () => {
    beforeEach(() => {
        mockCreateAsyncStorageCache.mockReset();
    });

    it('uses the provided cache and fetches authorization on mount', async () => {
        expect.assertions(7);
        const cache = createCache();
        const hook = renderHook(useProviderState, {
            initialProps: undefined,
            wrapper: createProviderWrapper({
                cache,
            }),
        });

        await act(async () => {
            await Promise.resolve();
        });

        expect(cache.get).toHaveBeenCalledTimes(1);
        expect(hook.result.cache).toBe(cache);
        expect(hook.result.chain).toBe(CHAIN);
        expect(hook.result.connection).toBeInstanceOf(Connection);
        expect(hook.result.connection.rpcEndpoint).toBe(ENDPOINT);
        expect(hook.result.identity).toBe(IDENTITY);
        expect(hook.result.store).toEqual(expect.objectContaining({ fetch: expect.any(Function), persist: expect.any(Function) }));
    });

    it('creates a default cache when one is not provided', async () => {
        expect.assertions(6);
        const cache = createCache();

        mockCreateAsyncStorageCache.mockReturnValue(cache as never);

        const hook = renderHook(useProviderState, {
            initialProps: undefined,
            wrapper: createProviderWrapper({}),
        });

        await act(async () => {
            await Promise.resolve();
        });

        expect(mockCreateAsyncStorageCache).toHaveBeenCalledTimes(1);
        expect(cache.get).toHaveBeenCalledTimes(1);
        expect(hook.result.cache).toBe(cache);
        expect(hook.result.chain).toBe(CHAIN);
        expect(hook.result.connection.rpcEndpoint).toBe(ENDPOINT);
        expect(hook.result.identity).toBe(IDENTITY);
    });
});

function createProviderWrapper({
    cache,
}: {
    cache?: Cache<WalletAuthorization | undefined>;
}) {
    return function ProviderWrapper({ children }: { children: unknown }) {
        return (
            <MobileWalletProvider cache={cache} chain={CHAIN} endpoint={ENDPOINT} identity={IDENTITY}>
                {children as ReactNode}
            </MobileWalletProvider>
        );
    };
}

function useProviderState(_: undefined) {
    return useContext(MobileWalletProviderContext);
}
