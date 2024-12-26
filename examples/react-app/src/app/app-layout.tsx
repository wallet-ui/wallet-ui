import { ReactNode } from 'react';

import { Header } from '../components/header.tsx';

export function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <Header />
            <main>{children}</main>
        </div>
    );
}
