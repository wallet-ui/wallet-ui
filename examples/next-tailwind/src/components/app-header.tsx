'use client';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AccountDropdown = dynamic(() => import('@wallet-ui/react').then(m => m.WalletUiDropdown), { ssr: false });
const ClusterDropdown = dynamic(() => import('@wallet-ui/react').then(m => m.WalletUiClusterDropdown), {
    ssr: false,
});

export function AppHeader({ links }: { links: { label: string; to: string }[] }) {
    const pathname = usePathname();

    return (
        <nav className="px-4 py-2 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex justify-between items-center">
                <Link href="/" className="flex items-center gap-4">
                    <Image src="/wallet-ui.png" alt="wallet-ui logo" width={32} height={32} />
                    <span className="text-lg font-semibold">Wallet UI</span>
                    <span className="font-light text-gray-500">React/Tailwind</span>
                </Link>

                <ul className="flex gap-4 p-4 text-xl leading-none">
                    {links.map(link => {
                        const isActive = link.to === '/' ? pathname === '/' : pathname.startsWith(link.to);
                        return (
                            <li key={link.to} className={isActive ? 'font-semibold' : 'font-light'}>
                                <Link href={link.to}>{link.label}</Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="flex items-center gap-4">
                <AccountDropdown size="sm" />
                <ClusterDropdown size="sm" />
            </div>
        </nav>
    );
}
