import Link from 'fumadocs-core/link';
import { Card } from 'fumadocs-ui/components/card';
import { GithubInfo } from 'fumadocs-ui/components/github-info';
import { Rocket } from 'lucide-react';

export default function HomePage() {
    return (
        <main className="flex flex-1 flex-col justify-center items-center gap-6">
            <div className="flex flex-col items-center">
                <h1 className="mb-4 text-2xl font-bold">Wallet UI</h1>
                <p className="mb-4 text-fd-muted-foreground">
                    The missing UI for the{' '}
                    <Link
                        href="https://github.com/wallet-standard/wallet-standard"
                        className="text-fd-foreground font-semibold underline"
                        external
                    >
                        Wallet Standard
                    </Link>
                </p>
                <p className="text-fd-muted-foreground">
                    Wallet UI supports what Wallet Standard supports, which is currently Solana and React.
                </p>
            </div>
            <Card
                icon={<Rocket />}
                title="Getting Started"
                href="/docs/react/getting-started"
                description="Get started with Wallet UI and React"
            />
            <GithubInfo owner="wallet-ui" repo="wallet-ui" />
        </main>
    );
}
