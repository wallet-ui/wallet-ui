import { baseOptions } from '@/app/layout.config';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <HomeLayout
            {...baseOptions}
            links={[
                {
                    text: 'Docs',
                    url: '/docs',
                },
                {
                    text: 'Demo',
                    url: '/demo',
                },
            ]}
        >
            {children}
        </HomeLayout>
    );
}
