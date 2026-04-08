import type { APIRoute, GetStaticPaths } from 'astro';
import { renderSocialImage, type DocsSocialImagePage } from '../../og-image';
import { getDocsSocialImagePages } from '../../og-image-pages';

export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
    const pages = await getDocsSocialImagePages();

    return pages
        .filter(page => page.slug)
        .map(page => ({
            params: { slug: page.slug },
            props: page,
        }));
};

export const GET: APIRoute = async ({ props }) => {
    const image = await renderSocialImage(props as DocsSocialImagePage);

    return new Response(new Uint8Array(image), {
        headers: {
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Content-Type': 'image/png',
        },
    });
};
