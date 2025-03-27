import Image from 'next/image';

export default function Home() {
    return (
        <div>
            <Image src="/wallet-ui.png" alt="Next.js logo" width={180} height={38} priority />
            FOO BAR
        </div>
    );
}
