import type { APIRoute } from 'astro';
import { renderSocialImage } from '../../og-image';
import { getDocsSocialImagePages } from '../../og-image-pages';

export const prerender = true;

export const GET: APIRoute = async () => {
	const page = (await getDocsSocialImagePages()).find((entry) => entry.slug === '');

	if (!page) {
		return new Response('Missing docs index social image data.', { status: 500 });
	}

	const image = await renderSocialImage(page);

	return new Response(new Uint8Array(image), {
		headers: {
			'Cache-Control': 'public, max-age=31536000, immutable',
			'Content-Type': 'image/png',
		},
	});
};
