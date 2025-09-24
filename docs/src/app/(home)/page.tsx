import { PackageBadges } from '@/components/package-badges';
import { siteConfig } from '@/site-config';
import icon from '@@/public/wallet-ui.png';
import Link from 'fumadocs-core/link';
import { Card } from 'fumadocs-ui/components/card';
import { GithubInfo } from 'fumadocs-ui/components/github-info';
import Image from 'next/image';

export default function HomePage() {
    return (
        <main className="flex flex-1 flex-col justify-center items-center gap-6">
            <h1 className="mx-auto mb-4 text-5xl font-bold">
                <Link href={'/'} className="inline-flex items-center gap-2">
                    <Image src={icon} alt={''} className="size-16"></Image> {siteConfig.name}
                </Link>
            </h1>

            <section className="mx-auto space-y-3 flex flex-col items-center gap-2 ">
                <p className="max-w-md text-fd-muted-foreground">
                    Wallet UI is the modern UI for the
                    <Link
                        href="https://github.com/wallet-standard/wallet-standard"
                        className="text-fd-foreground font-semibold underline"
                        external
                    >
                        {' '}
                        Wallet Standard
                    </Link>
                    .
                </p>

                <div className="gap-2 mx-auto flex flex-col items-center">
                    <PackageBadges packageName={siteConfig.packageName} />
                    <GithubInfo owner="wallet-ui" repo="wallet-ui" />
                </div>
            </section>

            <Card
                title="Getting Started"
                href="/docs/react/getting-started"
                description="Get started with Wallet UI and React"
            />
            <p className="text-fd-muted-foreground">
                Wallet UI supports what Wallet Standard supports, which is currently Solana and React.
            </p>
            <p className="text-fd-muted-foreground">
                Please{' '}
                <Link
                    external
                    href="https://github.com/wallet-ui/wallet-ui/discussions"
                    className="text-fd-foreground font-semibold underline"
                >
                    get in touch
                </Link>{' '}
                if you like to see support for other frameworks or chains.
            </p>
        </main>
    );
}
