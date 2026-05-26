import { createStorageAccount, type SolanaCluster } from '@wallet-ui/core';
import React, { useContext } from 'react';
import { act, create } from 'react-test-renderer';

import { createAccount, createWallet, type TestAccount, type TestWallet } from '../test-utils/wallet-ui-test-utils';
import { WalletUiAccountContext } from '../wallet-ui-account-context';
import { WalletUiAccountContextProvider } from '../wallet-ui-account-context-provider';

const CLUSTER: SolanaCluster = {
    id: 'solana:testnet',
    label: 'Testnet',
    url: 'https://api.testnet.solana.com',
};

const mockUseWallets = vi.fn();
let mockWallets: TestWallet[] = [];
type PersistentTesting = {
    getTestStorage(): Record<string, string | undefined>;
    useTestStorageEngine(): void;
};

vi.mock('@wallet-standard/react', async () => {
    const { mockWalletStandardReact } = await vi.importActual<typeof import('../test-utils/wallet-ui-test-utils')>(
        '../test-utils/wallet-ui-test-utils',
    );
    return mockWalletStandardReact(() => mockUseWallets());
});

describe('WalletUiAccountContextProvider', () => {
    const cleanups: Array<() => void> = [];

    beforeEach(async () => {
        vi.useFakeTimers();
        await resetPersistentTestStorage();
        mockUseWallets.mockReset();
        mockUseWallets.mockImplementation(() => mockWallets);
        mockWallets = [];
    });

    afterEach(() => {
        for (const cleanup of cleanups.splice(0).reverse()) {
            cleanup();
        }
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('restores the saved account and exposes the resolved wallet metadata', () => {
        expect.assertions(3);

        const phantomAccount = createAccount({ address: 'phantom-1', walletName: 'Phantom' });
        const phantomWallet = createWallet({ accounts: [phantomAccount], name: 'Phantom' });
        const storage = createStorageAccount();

        storage.set('Phantom:phantom-1');

        const view = renderProvider({ cleanups, storage, wallets: [phantomWallet] });

        expect(view.getContext().account).toBe(phantomAccount);
        expect(view.getContext().accountKeys).toEqual(['solana:testnet', 'Phantom:phantom-1']);
        expect(view.getContext().wallet).toBe(phantomWallet);
    });

    it('falls back to another account from the same wallet when the selected account disappears', () => {
        expect.assertions(3);

        const phantomAccount = createAccount({ address: 'phantom-1', walletName: 'Phantom' });
        const replacementAccount = createAccount({ address: 'phantom-2', walletName: 'Phantom' });
        const storage = createStorageAccount();

        storage.set('Phantom:phantom-1');

        const view = renderProvider({
            cleanups,
            storage,
            wallets: [createWallet({ accounts: [phantomAccount], name: 'Phantom' })],
        });

        view.rerender([createWallet({ accounts: [replacementAccount], name: 'Phantom' })]);

        expect(view.getContext().account).toBe(replacementAccount);
        expect(view.getContext().accountKeys).toEqual(['solana:testnet', 'Phantom:phantom-2']);
        expect(view.getContext().wallet?.name).toBe('Phantom');
    });

    it('clears the selected account when its wallet disappears from the registry', () => {
        expect.assertions(3);

        const phantomAccount = createAccount({ address: 'phantom-1', walletName: 'Phantom' });
        const storage = createStorageAccount();

        storage.set('Phantom:phantom-1');

        const view = renderProvider({
            cleanups,
            storage,
            wallets: [createWallet({ accounts: [phantomAccount], name: 'Phantom' })],
        });

        view.rerender([createWallet({ accounts: [], name: 'Solflare' })]);

        expect(view.getContext().account).toBeUndefined();
        expect(view.getContext().accountKeys).toEqual([]);
        expect(view.getContext().wallet).toBeUndefined();
    });
});

function renderProvider({
    cleanups,
    storage,
    wallets,
}: {
    cleanups: Array<() => void>;
    storage: ReturnType<typeof createStorageAccount>;
    wallets: TestWallet[];
}) {
    mockWallets = wallets;

    let contextValue:
        | {
              account?: TestAccount;
              accountKeys: string[];
              wallet?: TestWallet;
          }
        | undefined;

    function Probe() {
        contextValue = useContext(WalletUiAccountContext) as typeof contextValue;
        return null;
    }

    const renderNode = () => (
        <WalletUiAccountContextProvider cluster={CLUSTER} storage={storage}>
            <Probe />
        </WalletUiAccountContextProvider>
    );

    let renderer!: ReturnType<typeof create>;

    act(() => {
        renderer = create(renderNode());
    });

    cleanups.push(() => {
        act(() => {
            renderer.unmount();
        });
    });

    return {
        getContext() {
            if (!contextValue) {
                throw new Error('Missing account context value');
            }
            return contextValue;
        },
        rerender(nextWallets: TestWallet[]) {
            mockWallets = nextWallets;
            act(() => {
                renderer.update(renderNode());
            });
        },
    };
}

async function resetPersistentTestStorage() {
    const { getTestStorage, useTestStorageEngine } = await vi.importActual<PersistentTesting>('@nanostores/persistent');
    useTestStorageEngine();
    const storage = getTestStorage();
    for (const key of Object.keys(storage)) {
        delete storage[key];
    }
}
