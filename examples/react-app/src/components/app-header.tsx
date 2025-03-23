import { WalletUiClusterDropdown } from '@wallet-ui/react';
import { Link, useLocation } from 'react-router';

export type HeaderLink = { label: string; to: string };

export function AppHeader({ links }: { links: HeaderLink[] }) {
    const { pathname } = useLocation();
    return (
        <header style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexGrow: 1, gap: 20 }}>
                <Link to="/" style={{ alignItems: 'center', display: 'flex', gap: 10 }}>
                    <img src="/wallet-ui.png" alt="wallet-ui logo" width={32} height={32} />
                    <span style={{ fontSize: '1.25rem', fontWeight: 500, lineHeight: '1.6' }}>Wallet UI React App</span>
                </Link>
                <nav style={{ alignItems: 'center', display: 'flex', gap: 16 }}>
                    {links.map(link => (
                        <Link key={link.to} to={link.to} className={pathname.startsWith(link.to) ? 'active' : ''}>
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <div style={{ alignItems: 'center', display: 'flex', gap: 16 }}>
                <WalletUiClusterDropdown size="sm" />
                <a href="https://github.com/wallet-ui/wallet-ui" target="_blank" rel="noreferrer">
                    <img
                        src="https://img.shields.io/github/stars/wallet-ui/wallet-ui?style=social"
                        alt="GitHub Repo stars"
                    />
                </a>
            </div>
        </header>
    );
}
