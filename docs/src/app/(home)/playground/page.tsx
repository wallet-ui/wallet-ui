import { PlaygroundUiWalletButtons } from '@/components/playground/playground-ui-wallet-buttons';
import Link from 'next/link';

export default function PlaygroundPage() {
    return (
        <main className="flex flex-1 flex-col  py-4 gap-6">
            <h1 className="mb-4 text-2xl font-bold">Playground</h1>
            <p className="text-fd-muted-foreground">
                This is a playground page. You can open{' '}
                <Link href="/docs" className="text-fd-foreground font-semibold underline">
                    /docs
                </Link>{' '}
                and see the documentation.
            </p>
            <PlaygroundUiWalletButtons />
        </main>
    );
}
