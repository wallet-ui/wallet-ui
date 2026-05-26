import type { SolanaCluster } from '@wallet-ui/core';

import { createAccount, createWallet, type TestAccount, type TestWallet } from '../test-utils/wallet-ui-test-utils';

const CLUSTER: SolanaCluster = {
    id: 'solana:testnet',
    label: 'Testnet',
    url: 'https://api.testnet.solana.com',
};

const mockUseWallets = vi.fn();
let mockWallets: TestWallet[] = [];

vi.mock('@wallet-standard/react', async () => {
    const { mockWalletStandardReact } = await vi.importActual<typeof import('../test-utils/wallet-ui-test-utils')>(
        '../test-utils/wallet-ui-test-utils',
    );
    return mockWalletStandardReact(() => mockUseWallets());
});

describe('WalletUiAccountContextProvider actions', () => {
    const cleanups: Array<() => void> = [];

    beforeEach(() => {
        vi.useFakeTimers();
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

    it('stores the selected account and exposes it through context', async () => {
        expect.assertions(4);

        const account = createAccount({ address: 'phantom-1', walletName: 'Phantom' });
        const wallet = createWallet({ accounts: [account], name: 'Phantom' });
        const view = await renderProvider(cleanups, [wallet]);

        view.act(() => {
            view.getContext().setAccount(account);
        });

        expect(view.storage.get()).toBe('Phantom:phantom-1');
        expect(view.getContext().account).toEqual(account);
        expect(view.getContext().accountKeys).toEqual(['solana:testnet', 'Phantom:phantom-1']);
        expect(view.getContext().wallet?.name).toBe('Phantom');
    });

    it('clears the selected account and storage when set to undefined', async () => {
        expect.assertions(4);

        const account = createAccount({ address: 'phantom-1', walletName: 'Phantom' });
        const wallet = createWallet({ accounts: [account], name: 'Phantom' });
        const view = await renderProvider(cleanups, [wallet]);

        view.act(() => {
            view.getContext().setAccount(account);
        });
        view.act(() => {
            view.getContext().setAccount(undefined);
        });

        expect(view.storage.get()).toBeUndefined();
        expect(view.getContext().account).toBeUndefined();
        expect(view.getContext().accountKeys).toEqual([]);
        expect(view.getContext().wallet).toBeUndefined();
    });

    it('does not auto-reselect a saved account after an explicit selection has occurred', async () => {
        expect.assertions(5);

        const account = createAccount({ address: 'phantom-1', walletName: 'Phantom' });
        const wallet = createWallet({ accounts: [account], name: 'Phantom' });
        const view = await renderProvider(cleanups, [wallet]);

        view.act(() => {
            view.getContext().setAccount(account);
        });
        view.rerender([]);

        expect(view.getContext().account).toBeUndefined();
        expect(view.storage.get()).toBe('Phantom:phantom-1');

        view.rerender([wallet]);

        expect(view.getContext().account).toBeUndefined();
        expect(view.getContext().accountKeys).toEqual([]);
        expect(view.getContext().wallet).toBeUndefined();
    });
});

async function renderProvider(cleanups: Array<() => void>, initialWallets: TestWallet[]) {
    mockWallets = initialWallets;

    let harness:
        | {
              act: typeof import('react-test-renderer').act;
              getContext(): {
                  account?: TestAccount;
                  accountKeys: string[];
                  setAccount(value: TestAccount | undefined): void;
                  wallet?: TestWallet;
              };
              rerender(nextWallets: TestWallet[]): void;
              storage: { get(): string | undefined };
              unmount(): void;
          }
        | undefined;

    vi.resetModules();
    {
        const React = await import('react');
        const persistent: {
            getTestStorage(): Record<string, string | undefined>;
            useTestStorageEngine(): void;
        } = await vi.importActual('@nanostores/persistent');
        const { getTestStorage, useTestStorageEngine } = persistent;
        const { createStorageAccount } = await import('@wallet-ui/core');
        const { act, create } = await import('react-test-renderer');
        const { WalletUiAccountContext } = await import('../wallet-ui-account-context');
        const { WalletUiAccountContextProvider } = await import('../wallet-ui-account-context-provider');

        let contextValue:
            | {
                  account?: TestAccount;
                  accountKeys: string[];
                  setAccount(value: TestAccount | undefined): void;
                  wallet?: TestWallet;
              }
            | undefined;

        useTestStorageEngine();
        resetTestStorage(getTestStorage());
        const storage = createStorageAccount();

        function Probe() {
            contextValue = React.useContext(WalletUiAccountContext) as typeof contextValue;
            return null;
        }

        const renderNode = () =>
            React.createElement(WalletUiAccountContextProvider, {
                children: React.createElement(Probe),
                cluster: CLUSTER,
                storage,
            });

        let renderer!: ReturnType<typeof create>;

        act(() => {
            renderer = create(renderNode());
        });

        harness = {
            act,
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
            storage,
            unmount() {
                act(() => {
                    renderer.unmount();
                });
            },
        };
    }

    if (!harness) {
        throw new Error('Failed to create account provider harness');
    }

    const result = harness;

    cleanups.push(() => {
        result.unmount();
    });

    return result;
}

function resetTestStorage(storage: Record<string, string | undefined>) {
    for (const key of Object.keys(storage)) {
        delete storage[key];
    }
}
