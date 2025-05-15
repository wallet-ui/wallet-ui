import { GithubInfo } from 'fumadocs-ui/components/github-info';
import Link from 'next/link';

export default function HomePage() {
    return (
        <main className="flex flex-1 flex-col justify-center items-center gap-6">
            <div className="flex flex-col items-center">
                <h1 className="mb-4 text-2xl font-bold">Wallet UI</h1>
                <h1 className="mb-4 text-fd-muted-foreground">Work in Progress</h1>
                <p className="text-fd-muted-foreground">
                    You can open{' '}
                    <Link href="/docs" className="text-fd-foreground font-semibold underline">
                        /docs
                    </Link>{' '}
                    or{' '}
                    <Link href="/playground" className="text-fd-foreground font-semibold underline">
                        /playground
                    </Link>
                    .
                </p>
            </div>
            <GithubInfo owner="wallet-ui" repo="wallet-ui" />
        </main>
    );
}
