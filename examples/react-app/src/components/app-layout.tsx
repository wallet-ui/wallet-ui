import { ReactNode } from 'react';

import { AppHeader, HeaderLink } from './app-header.tsx';

export function AppLayout({ children, links }: { children: ReactNode; links: HeaderLink[] }) {
    return (
        <div>
            <AppHeader links={links} />
            <main>{children}</main>
        </div>
    );
}
