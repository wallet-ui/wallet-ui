import { Card, Cards } from 'fumadocs-ui/components/card';

const item = [
    {
        id: 'account-guard',
        name: 'WalletUiAccountGuard',
        description: 'A component that guards content based on wallet connection state.',
    },
    {
        id: 'cluster-dropdown',
        name: 'WalletUiClusterDropdown',
        description: 'Dropdown that lists clusters and allows to switch between them',
    },
    {
        id: 'dropdown',
        name: 'WalletUiDropdown',
        description: 'Dropdown that lists wallets, allows to connect and disconnect',
    },
];

export function DocsReactComponentGrid() {
    return (
        <section className="py-4">
            <Cards>
                {item.map(item => (
                    <Card
                        key={item.id}
                        href={`./components/${item.id}`}
                        title={item.name}
                        description={item.description}
                    />
                ))}
            </Cards>
        </section>
    );
}
