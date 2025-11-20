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
];

export function DocsReactNativeHooksGrid() {
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
