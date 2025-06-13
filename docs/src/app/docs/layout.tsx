import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <DocsLayout githubUrl="https://github.com/wallet-ui/wallet-ui" tree={source.pageTree} {...baseOptions}>
            {children}
        </DocsLayout>
    );
}
