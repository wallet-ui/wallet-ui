import { createStorageAccount, createStorageCluster, type SolanaCluster } from '@wallet-ui/core';
import React from 'react';
import { act, create } from 'react-test-renderer';

import { createAccount, createWallet, type TestAccount, type TestWallet } from '../test-utils/wallet-ui-test-utils';
import { useWalletUi } from '../use-wallet-ui';
import { createWalletUiConfig } from '../wallet-ui';
import { WalletUi } from '../wallet-ui';

const CLUSTERS: SolanaCluster[] = [
    {
        id: 'solana:devnet',
        label: 'Devnet',
        url: 'https://api.devnet.solana.com',
    },
    {
        id: 'solana:testnet',
        label: 'Testnet',
        url: 'https://api.testnet.solana.com',
    },
];

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

describe('WalletUi', () => {
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

    it('returns the provided wallet-ui config unchanged', () => {
        const config = createWalletUiConfig({
            clusters: CLUSTERS,
        });

        expect(config).toEqual({
            clusters: CLUSTERS,
        });
    });

    it('restores stored provider state and clears the selected account on disconnect', () => {
        expect.assertions(9);

        const account = createAccount({ address: 'phantom-1', walletName: 'Phantom' });
        const accountStorage = createStorageAccount();
        const clusterStorage = createStorageCluster();
        const wallet = createWallet({ accounts: [account], name: 'Phantom' });

        accountStorage.set('Phantom:phantom-1');
        clusterStorage.set('solana:testnet');

        const view = renderWalletUi({
            accountStorage,
            cleanups,
            clusterStorage,
            wallets: [wallet],
        });

        expect(view.getContext().account).toBe(account);
        expect(view.getContext().accountKeys).toEqual(['solana:testnet', 'Phantom:phantom-1']);
        expect(view.getContext().cluster).toBe(CLUSTERS[1]);
        expect(view.getContext().connected).toBe(true);
        expect(view.getContext().wallet).toBe(wallet);

        act(() => {
            view.getContext().disconnect();
        });

        expect(accountStorage.get()).toBeUndefined();
        expect(view.getContext().account).toBeUndefined();
        expect(view.getContext().connected).toBe(false);
        expect(view.getContext().wallet).toBeUndefined();
    });
});

function renderWalletUi({
    accountStorage,
    cleanups,
    clusterStorage,
    wallets,
}: {
    accountStorage: ReturnType<typeof createStorageAccount>;
    cleanups: Array<() => void>;
    clusterStorage: ReturnType<typeof createStorageCluster>;
    wallets: TestWallet[];
}) {
    mockWallets = wallets;

    let contextValue:
        | {
              account?: TestAccount;
              accountKeys: string[];
              cluster: SolanaCluster;
              connected: boolean;
              disconnect(): void;
              wallet?: TestWallet;
          }
        | undefined;

    function Probe() {
        contextValue = useWalletUi() as typeof contextValue;
        return null;
    }

    let renderer!: ReturnType<typeof create>;

    act(() => {
        renderer = create(
            <WalletUi
                config={{
                    accountStorage,
                    clusterStorage,
                    clusters: CLUSTERS,
                }}
            >
                <Probe />
            </WalletUi>,
        );
    });

    cleanups.push(() => {
        act(() => {
            renderer.unmount();
        });
    });

    return {
        getContext() {
            if (!contextValue) {
                throw new Error('Missing wallet UI value');
            }
            return contextValue;
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
