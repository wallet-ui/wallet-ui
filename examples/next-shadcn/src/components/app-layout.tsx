import React from 'react';
import { AppHeader } from './app-header.tsx';
import { ThemeToggle } from './theme-toggle.tsx';

export function AppLayout({ children, links }: { children: React.ReactNode; links: { label: string; to: string }[] }) {
    return (
        <div className="flex flex-col h-screen justify-between">
            <AppHeader links={links} />
            <main className="p-4 flex-1 h-full overflow-y-auto">{children}</main>
            <footer className="flex justify-between items-center p-4 text-center border-t border-gray-200 dark:border-gray-700 text-gray-500 text-sm">
                <div className="w-1/3 text-left">
                    <a href="https://github.com/wallet-ui/wallet-ui" target="_blank" rel="noreferrer">
                        <img
                            src="https://img.shields.io/github/stars/wallet-ui/wallet-ui?style=social"
                            alt="GitHub Repo stars"
                        />
                    </a>
                </div>
                <div className="w-1/3">
                    <a href="https://github.com/wallet-ui/wallet-ui" target="_blank" rel="noreferrer">
                        github.com/wallet-ui/wallet-ui
                    </a>
                </div>
                <div className="w-1/3 text-right">
                    <ThemeToggle />
                </div>
            </footer>
        </div>
    );
}
