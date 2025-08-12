import { siteConfig } from '@/site-config';
import './global.css';
import { Analytics } from '@vercel/analytics/next';
import { RootProvider } from 'fumadocs-ui/provider';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

const inter = Inter({
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: {
        default: `${siteConfig.name} - The modern UI for Wallet Standard`,
        template: `%s | ${siteConfig.name} - The modern UI for Wallet Standard`,
    },
    openGraph: {
        images: {
            url: '/og.png',
        },
    },
    metadataBase: new URL(siteConfig.url),
    description: siteConfig.description,
};

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className={inter.className} suppressHydrationWarning>
            <body className="flex flex-col min-h-screen">
                <RootProvider>{children}</RootProvider>
                <Analytics />
            </body>
        </html>
    );
}
