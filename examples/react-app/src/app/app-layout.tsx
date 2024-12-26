import { ReactNode } from 'react';

import { Header, HeaderLink } from '../components/header.tsx';

export function AppLayout({ children, links }: { children: ReactNode; links: HeaderLink[] }) {
    return (
        <div>
            <Header links={links} />
            <main>{children}</main>
        </div>
    );
}
