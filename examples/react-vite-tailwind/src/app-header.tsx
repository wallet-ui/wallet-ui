import { Link, useLocation } from 'react-router';

export function AppHeader({ links }: { links: { label: string; to: string }[] }) {
    const { pathname } = useLocation();

    return (
        <nav className="px-4 py-2 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/wallet-ui.png" alt="wallet-ui logo" width={32} height={32} />
                    <span className="text-lg font-semibold">Wallet UI - React + Vite + Tailwind</span>
                </Link>

                <ul className="flex gap-2 p-4">
                    {links.map(link => {
                        const isActive = link.to === '/' ? pathname === '/' : pathname.startsWith(link.to);
                        return (
                            <li key={link.to} className={isActive ? 'font-bold' : ''}>
                                <Link to={link.to}>{link.label}</Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <a href="https://github.com/wallet-ui/wallet-ui" target="_blank" rel="noreferrer">
                <img
                    src="https://img.shields.io/github/stars/wallet-ui/wallet-ui?style=social"
                    alt="GitHub Repo stars"
                />
            </a>
        </nav>
    );
}
