import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import {
	siteDescription,
} from './site-meta.mjs';
import {
	formatSocialTitle,
	getDocsSocialImagePath,
	getSocialImageAlt,
	normalizeDocsSlug,
	socialImageHeight,
	socialImageWidth,
} from './og-image';

export const onRequest = defineRouteMiddleware(async (context, next) => {
	await next();

	const { entry, head } = context.locals.starlightRoute;
	const pageDescription = entry.data.description ?? siteDescription;
	const socialTitle = formatSocialTitle(entry.data.title);
	const socialImagePath = getDocsSocialImagePath(normalizeDocsSlug(entry.id));
	const socialImageUrl = new URL(socialImagePath, context.site ?? context.url).toString();
	const socialImageAlt = getSocialImageAlt(entry.data.title);

	setMeta(head, 'property', 'og:title', socialTitle);
	setMeta(head, 'property', 'og:description', pageDescription);
	setMeta(head, 'property', 'og:image', socialImageUrl);
	setMeta(head, 'property', 'og:image:alt', socialImageAlt);
	setMeta(head, 'property', 'og:image:width', String(socialImageWidth));
	setMeta(head, 'property', 'og:image:height', String(socialImageHeight));
	setMeta(head, 'name', 'twitter:title', socialTitle);
	setMeta(head, 'name', 'twitter:description', pageDescription);
	setMeta(head, 'name', 'twitter:image', socialImageUrl);
	setMeta(head, 'name', 'twitter:image:alt', socialImageAlt);
});

function setMeta(
	head: {
		tag: string;
		attrs?: Record<string, string | boolean | undefined>;
		content?: string;
	}[],
	attrName: 'name' | 'property',
	attrValue: string,
	content: string
) {
	const tag = head.find(
		(entry) => entry.tag === 'meta' && entry.attrs?.[attrName] === attrValue
	);

	if (tag) {
		tag.attrs = {
			...tag.attrs,
			content,
		};
		return;
	}

	head.push({
		tag: 'meta',
		attrs: {
			[attrName]: attrValue,
			content,
		},
	});
}
