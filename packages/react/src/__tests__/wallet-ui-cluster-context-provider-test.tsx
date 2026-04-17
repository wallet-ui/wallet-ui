import { createStorageCluster, type SolanaCluster } from '@wallet-ui/core';
import React, { useContext } from 'react';
import { act, create } from 'react-test-renderer';

import { WalletUiClusterContext } from '../wallet-ui-cluster-context';
import { WalletUiClusterContextProvider } from '../wallet-ui-cluster-context-provider';

const CLUSTERS: SolanaCluster[] = [
    {
        id: 'solana:devnet',
        label: 'Devnet',
        url: 'https://api.devnet.solana.com',
    },
    {
        id: 'solana:mainnet',
        label: 'Mainnet',
        url: 'https://api.mainnet-beta.solana.com',
    },
    {
        id: 'solana:testnet',
        label: 'Testnet',
        url: 'https://api.testnet.solana.com',
    },
];

describe('WalletUiClusterContextProvider', () => {
    const cleanups: Array<() => void> = [];

    beforeEach(() => {
        jest.useFakeTimers();
        resetPersistentTestStorage();
    });

    afterEach(() => {
        for (const cleanup of cleanups.splice(0).reverse()) {
            cleanup();
        }
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('throws when no clusters are provided', () => {
        expect.assertions(1);

        const storage = createStorageCluster();

        expect(() =>
            act(() => {
                create(
                    <WalletUiClusterContextProvider clusters={[]} render={() => null} storage={storage} />,
                );
            }),
        ).toThrow('No clusters provided');
    });

    it('restores the stored cluster when the stored id exists', () => {
        expect.assertions(2);

        const storage = createStorageCluster();

        storage.set('solana:testnet');

        const view = renderProvider({ cleanups, clusters: CLUSTERS, storage });

        expect(view.getContext().cluster).toBe(CLUSTERS[2]);
        expect(view.getRenderValue().cluster).toBe(CLUSTERS[2]);
    });

    it('falls back to the first cluster when the stored id is missing', () => {
        expect.assertions(2);

        const storage = createStorageCluster();

        storage.set('solana:devnet');

        const view = renderProvider({
            cleanups,
            clusters: [CLUSTERS[1], CLUSTERS[2]],
            storage,
        });

        expect(view.getContext().cluster).toBe(CLUSTERS[1]);
        expect(view.getRenderValue().cluster).toBe(CLUSTERS[1]);
    });

    it('persists a valid cluster selection and updates the exposed cluster', () => {
        expect.assertions(3);

        const storage = createStorageCluster();
        const view = renderProvider({ cleanups, clusters: CLUSTERS, storage });

        act(() => {
            view.getContext().setCluster('solana:testnet');
        });

        expect(storage.get()).toBe('solana:testnet');
        expect(view.getContext().cluster).toBe(CLUSTERS[2]);
        expect(view.getRenderValue().cluster).toBe(CLUSTERS[2]);
    });

    it('throws when selecting a cluster that is not in the provided list', () => {
        expect.assertions(2);

        const storage = createStorageCluster();
        const view = renderProvider({ cleanups, clusters: CLUSTERS, storage });

        expect(() => {
            view.getContext().setCluster('solana:localnet');
        }).toThrow('Cluster solana:localnet not found');
        expect(storage.get()).toBe('solana:devnet');
    });
});

function renderProvider({
    cleanups,
    clusters,
    storage,
}: {
    cleanups: Array<() => void>;
    clusters: SolanaCluster[];
    storage: ReturnType<typeof createStorageCluster>;
}) {
    let contextValue:
        | {
              cluster: SolanaCluster;
              clusters: SolanaCluster[];
              setCluster(clusterId: `solana:${string}`): void;
          }
        | undefined;
    let renderValue: typeof contextValue;

    function Probe() {
        contextValue = useContext(WalletUiClusterContext) as typeof contextValue;
        return null;
    }

    let renderer!: ReturnType<typeof create>;

    act(() => {
        renderer = create(
            <WalletUiClusterContextProvider
                clusters={clusters}
                render={value => {
                    renderValue = value as typeof renderValue;
                    return <Probe />;
                }}
                storage={storage}
            />,
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
                throw new Error('Missing cluster context value');
            }
            return contextValue;
        },
        getRenderValue() {
            if (!renderValue) {
                throw new Error('Missing render prop value');
            }
            return renderValue;
        },
    };
}

function resetPersistentTestStorage() {
    const persistent: {
        getTestStorage(): Record<string, string | undefined>;
        useTestStorageEngine(): void;
    } = jest.requireActual('@nanostores/persistent');
    const installTestStorageEngine = persistent.useTestStorageEngine;

    installTestStorageEngine();
    const storage = persistent.getTestStorage();
    for (const key of Object.keys(storage)) {
        delete storage[key];
    }
}
