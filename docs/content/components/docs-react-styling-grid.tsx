import { Card, Cards } from 'fumadocs-ui/components/card';

const items = [
    {
        id: 'tailwind',
        name: 'Tailwind CSS',
        description: 'Provides a default theme and the necessary Tailwind CSS styles for the `@wallet-ui/react` components.',
    },
    {
        id: 'react-css',
        name: 'React CSS',
        description: 'Provides a default theme for the `@wallet-ui/react` components.',
    },
];

export function DocsReactStylingGrid() {
    return (
        <section className="py-4">
            <Cards>
                {items.map(item => (
                    <Card
                        key={item.id}
                        href={`./styling/${item.id}`}
                        title={item.name}
                        description={item.description}
                    />
                ))}
            </Cards>
        </section>
    );
}
