import { Card, Cards } from 'fumadocs-ui/components/card';

const item = [
    {
        id: 'dropdown',
        name: 'WalletUiDropdown',
        description: 'Dropdown that lists wallets, allows to connect and disconnect',
    },
    {
        id: 'cluster-dropdown',
        name: 'WalletUiClusterDropdown',
        description: 'Dropdown that lists clusters and allows to switch between them',
    },
];

export function DocsReactComponentGrid() {
    return (
        <section className="py-4">
            <Cards>
                {item.map(item => (
                    <Card key={item.id} href={`./${item.id}`} title={item.name} description={item.description} />
                ))}
            </Cards>
        </section>
    );
}
