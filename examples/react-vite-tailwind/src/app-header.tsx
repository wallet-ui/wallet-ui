import { WalletUiClusterDropdown, WalletUiDropdown } from '@wallet-ui/react';
import { Link, useLocation } from 'react-router';

export function AppHeader({ links }: { links: { label: string; to: string }[] }) {
    const { pathname } = useLocation();

    return (
        <nav className="px-4 py-2 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex justify-between items-center">
                <Link to="/" className="flex items-center gap-4">
                    <img src="/wallet-ui.png" alt="wallet-ui logo" width={32} height={32} />
                    <span className="text-lg font-semibold">Wallet UI</span>
                    <span className="font-light text-gray-500">React/Tailwind</span>
                </Link>

                <ul className="flex gap-4 p-4 text-xl leading-none">
                    {links.map(link => {
                        const isActive = link.to === '/' ? pathname === '/' : pathname.startsWith(link.to);
                        return (
                            <li key={link.to} className={isActive ? 'font-semibold' : 'font-light'}>
                                <Link to={link.to}>{link.label}</Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="flex items-center gap-4">
                <WalletUiDropdown size="sm" />
                <WalletUiClusterDropdown size="sm" />
            </div>
        </nav>
    );
}
