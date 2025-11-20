import { Card, Cards } from 'fumadocs-ui/components/card';

const items = [
    {
        id: 'use-authorization',
        name: 'useAuthorization',
        description: 'The primary hook for interacting with wallet state.',
    },
    {
        id: 'use-mobile-wallet',
        name: 'useMobileWallet',
        description: 'A hook to access the current wallet account and its setter.',
    },
    {
        id: 'use-mobile-wallet-adapter',
        name: 'useMobileWalletAdapter',
        description: 'A hook to access and manage the current Solana cluster.',
    },
];

export function DocsReactNativeWeb3jsHooksGrid() {
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
