import { Card, Cards } from 'fumadocs-ui/components/card';

const items = [
    { id: 'next', name: 'Next.js', description: 'Set up Wallet UI with Next.js' },
    { id: 'vite', name: 'Vite', description: 'Set up Wallet UI with Vite' },
    { id: 'react-router', name: 'React Router', description: 'Set up Wallet UI with React Router' },
];

export function FrameworkGrid() {
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
