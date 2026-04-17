import type { SolanaCluster } from '@wallet-ui/core';
import React, { useContext } from 'react';
import { act, create } from 'react-test-renderer';

import {
    createAccount,
    createWallet,
    type TestAccount,
    type TestWallet,
} from '../test-utils/wallet-ui-test-utils';
import { WalletUiAccountContext } from '../wallet-ui-account-context';
import { WalletUiContext } from '../wallet-ui-context';
import { WalletUiContextProvider } from '../wallet-ui-context-provider';

const CLUSTER: SolanaCluster = {
    id: 'solana:testnet',
    label: 'Testnet',
    url: 'https://api.testnet.solana.com',
};

const mockHandleCopyText = jest.fn();
const mockUseWallets = jest.fn();
let mockWallets: TestWallet[] = [];
const cleanups: Array<() => void> = [];

jest.mock('@wallet-standard/react', () => {
    const { mockWalletStandardReact } = jest.requireActual<typeof import('../test-utils/wallet-ui-test-utils')>(
        '../test-utils/wallet-ui-test-utils',
    );
    return mockWalletStandardReact(() => mockUseWallets());
});

jest.mock('@wallet-ui/core', () => ({
    handleCopyText: (...args: unknown[]) => mockHandleCopyText(...args),
}));

describe('WalletUiContextProvider', () => {
    beforeEach(() => {
        mockHandleCopyText.mockReset();
        mockUseWallets.mockReset();
        mockUseWallets.mockImplementation(() => mockWallets);
        mockWallets = [];
    });

    afterEach(() => {
        for (const cleanup of cleanups.splice(0).reverse()) {
            cleanup();
        }
    });

    it('filters to Solana wallets, sorts them alphabetically, and reports disconnected state when no account is selected', () => {
        expect.assertions(3);

        const setAccount = jest.fn();
        const backpackWallet = createWallet({ accounts: [], name: 'Backpack' });
        const ethereumWallet = createWallet({ chains: ['eip155:1'], name: 'Ethereum Wallet' });
        const solflareWallet = createWallet({ accounts: [], name: 'Solflare' });
        const view = renderProvider({
            account: undefined,
            setAccount,
            wallet: undefined,
            wallets: [solflareWallet, ethereumWallet, backpackWallet],
        });

        expect(view.getContext().connected).toBe(false);
        expect(view.getContext().wallets.map(wallet => wallet.name)).toEqual(['Backpack', 'Solflare']);

        view.getContext().copy();

        expect(mockHandleCopyText).not.toHaveBeenCalled();
    });

    it('delegates connect, disconnect, and copy through the account context state', () => {
        expect.assertions(4);

        const account = createAccount({ address: 'phantom-1', walletName: 'Phantom' });
        const setAccount = jest.fn();
        const wallet = createWallet({ accounts: [account], name: 'Phantom' });
        const view = renderProvider({
            account,
            setAccount,
            wallet,
            wallets: [wallet],
        });

        expect(view.getContext().connected).toBe(true);

        view.getContext().connect(account);
        view.getContext().disconnect();
        view.getContext().copy();

        expect(setAccount).toHaveBeenNthCalledWith(1, account);
        expect(setAccount).toHaveBeenNthCalledWith(2, undefined);
        expect(mockHandleCopyText).toHaveBeenCalledWith('phantom-1');
    });
});

function renderProvider({
    account,
    setAccount,
    wallet,
    wallets,
}: {
    account: TestAccount | undefined;
    setAccount: jest.Mock;
    wallet: TestWallet | undefined;
    wallets: TestWallet[];
}) {
    mockWallets = wallets;

    let contextValue:
        | {
              account?: TestAccount;
              accountKeys: string[];
              connect(account: TestAccount): void;
              connected: boolean;
              copy(): void;
              disconnect(): void;
              wallet?: TestWallet;
              wallets: TestWallet[];
          }
        | undefined;

    function Probe() {
        contextValue = useContext(WalletUiContext) as unknown as typeof contextValue;
        return null;
    }

    const accountContextValue = {
        account,
        accountKeys: account ? [CLUSTER.id, `${account.walletName}:${account.address}`] : [],
        cluster: CLUSTER,
        setAccount,
        wallet,
    } as unknown as React.ContextType<typeof WalletUiAccountContext>;

    let renderer!: ReturnType<typeof create>;

    act(() => {
        renderer = create(
            <WalletUiAccountContext.Provider value={accountContextValue}>
                <WalletUiContextProvider>
                    <Probe />
                </WalletUiContextProvider>
            </WalletUiAccountContext.Provider>,
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
                throw new Error('Missing wallet UI context value');
            }
            return contextValue;
        },
    };
}
