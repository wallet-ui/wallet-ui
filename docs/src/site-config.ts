export type SiteConfig = {
    description: string;
    domain: string;
    links: {
        github: string;
    };
    name: string;
    ogImage: string;
    packageName: string;
    slug: string;
    url: string;
};

export const siteConfig: SiteConfig = {
    description: 'Wallet UI is the modern UI for the Wallet Standard.',
    domain: 'wallet-ui.dev',
    links: {
        github: 'https://github.com/wallet-ui/wallet-ui',
    },
    name: 'Wallet UI',
    ogImage: 'https://wallet-ui.dev/og.png',
    packageName: '@wallet-ui/react',
    slug: 'wallet-ui',
    url: 'https://wallet-ui.dev',
};
