import Link from 'next/link';

export default function DemoPage() {
    return (
        <main className="flex flex-1 flex-col justify-center text-center">
            <h1 className="mb-4 text-2xl font-bold">Demo</h1>
            <p className="text-fd-muted-foreground">
                This is a demo page. You can open{' '}
                <Link href="/docs" className="text-fd-foreground font-semibold underline">
                    /docs
                </Link>{' '}
                and see the documentation.
            </p>
        </main>
    );
}
