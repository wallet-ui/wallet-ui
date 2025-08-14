import { Card, Cards } from 'fumadocs-ui/components/card';

const items = [
    {
        id: 'css',
        name: 'Plain CSS',
        description: 'Use the pre-built CSS file to style the `@wallet-ui/react` components.',
    },
    {
        id: 'tailwind',
        name: 'Tailwind CSS',
        description: 'Use the Tailwind CSS plugin to style the `@wallet-ui/react` components.',
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
