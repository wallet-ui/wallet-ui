import { Card, Cards } from 'fumadocs-ui/components/card';

const items = [{ id: 'expo', name: 'Expo', description: 'Set up Wallet UI with Expo' }];

export function DocsReactNativeFrameworkGrid() {
    return (
        <section className="py-4">
            <Cards>
                {items.map(item => (
                    <Card key={item.id} href={`./guides/${item.id}`} title={item.name} description={item.description} />
                ))}
            </Cards>
        </section>
    );
}
