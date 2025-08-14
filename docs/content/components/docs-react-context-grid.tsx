import { Card, Cards } from 'fumadocs-ui/components/card';

const items = [
    {
        id: 'wallet-ui-account-context',
        name: 'WalletUiAccountContext',
        description: 'The context for the currently selected wallet account.',
    },
    {
        id: 'wallet-ui-account-context-provider',
        name: 'WalletUiAccountContextProvider',
        description: 'The provider for the WalletUiAccountContext.',
    },
    {
        id: 'wallet-ui-cluster-context',
        name: 'WalletUiClusterContext',
        description: 'The context for the currently selected Solana cluster.',
    },
    {
        id: 'wallet-ui-cluster-context-provider',
        name: 'WalletUiClusterContextProvider',
        description: 'The provider for the WalletUiClusterContext.',
    },
    {
        id: 'wallet-ui-context',
        name: 'WalletUiContext',
        description: 'The main context for Wallet UI.',
    },
    {
        id: 'wallet-ui-context-provider',
        name: 'WalletUiContextProvider',
        description: 'The provider for the WalletUiContext.',
    },
    {
        id: 'wallet-ui-solana-client-context',
        name: 'WalletUiSolanaClientContext',
        description: 'The context for the Solana client.',
    },
    {
        id: 'wallet-ui-solana-client-context-provider',
        name: 'WalletUiSolanaClientContextProvider',
        description: 'The provider for the WalletUiSolanaClientContext.',
    },
    // Add other contexts here as they are documented
];

export function DocsReactContextGrid() {
    return (
        <section className="py-4">
            <Cards>
                {items.map(item => (
                    <Card
                        key={item.id}
                        href={`./context/${item.id}`}
                        title={item.name}
                        description={item.description}
                    />
                ))}
            </Cards>
        </section>
    );
}
