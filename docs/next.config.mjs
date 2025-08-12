import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
    reactStrictMode: true,
    logging: {
        fetches: {
            fullUrl: true
        }
    },
    async redirects() {
        return [
            {
                source: '/docs',
                destination: '/docs/react',
                permanent: true
            },
            {
                source: '/docs/react',
                destination: '/docs/react/getting-started',
                permanent: true
            }
        ];
    }
};

export default withMDX(config);
