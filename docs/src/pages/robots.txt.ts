import type { APIRoute } from 'astro';
import { canIndexHost, siteUrl } from '../site-meta.mjs';

export const prerender = false;

export const GET: APIRoute = ({ request }) => {
    const { hostname } = new URL(request.url);
    const body = canIndexHost(hostname)
        ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', siteUrl).toString()}\n`
        : 'User-agent: *\nDisallow: /\n';

    return new Response(body, {
        headers: {
            'content-type': 'text/plain; charset=utf-8',
        },
    });
};
