import { getCollection } from 'astro:content';
import {
	getDocsSocialImagePath,
	normalizeDocsSlug,
	type DocsSocialImagePage,
} from './og-image';
import { siteDescription } from './site-meta.mjs';

export async function getDocsSocialImagePages(): Promise<DocsSocialImagePage[]> {
	const entries = await getCollection('docs', ({ data }) => {
		return import.meta.env.MODE !== 'production' || data.draft === false;
	});

	return entries.map((entry) => {
		const slug = normalizeDocsSlug(entry.id);
		return {
			description: entry.data.description ?? siteDescription,
			path: getDocsSocialImagePath(slug),
			slug,
			title: entry.data.title,
		};
	});
}
