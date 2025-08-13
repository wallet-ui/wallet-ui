import { Card, Cards } from 'fumadocs-ui/components/card';

const items = [
    {
        id: 'use-wallet-ui',
        name: 'useWalletUi',
        description: 'The primary hook for interacting with wallet state.',
    },
    {
        id: 'use-wallet-ui-account',
        name: 'useWalletUiAccount',
        description: 'A hook to access the current wallet account and its setter.',
    },
    {
        id: 'use-wallet-ui-cluster',
        name: 'useWalletUiCluster',
        description: 'A hook to access and manage the current Solana cluster.',
    },
    {
        id: 'use-wallet-ui-dropdown',
        name: 'useWalletUiDropdown',
        description: 'A hook that provides the logic for a wallet dropdown menu.',
    },
    {
        id: 'use-wallet-ui-signer',
        name: 'useWalletUiSigner',
        description: 'A hook to get a transaction signer for the active wallet.',
    },
    {
        id: 'use-wallet-ui-solana-client',
        name: 'useWalletUiSolanaClient',
        description: 'A hook to get the underlying Solana RPC client.',
    },
    {
        id: 'use-wallet-ui-sign-and-send',
        name: 'useWalletUiSignAndSend',
        description: 'A hook to easily sign and send a transaction.',
    },
    // Add other hooks here as they are documented
];

export function DocsReactHooksGrid() {
    return (
        <section className="py-4">
            <Cards>
                {items.map(item => (
                    <Card key={item.id} href={`./hooks/${item.id}`} title={item.name} description={item.description} />
                ))}
            </Cards>
        </section>
    );
}
