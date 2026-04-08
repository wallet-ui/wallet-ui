import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { siteDescription, siteName } from './site-meta.mjs';

export const socialImageWidth = 1200;
export const socialImageHeight = 630;
const maxTitleLines = 3;
const maxDescriptionLines = 3;
const walletUiLogoDataUrlPromise = readFile(join(process.cwd(), 'src/assets/wallet-ui.png')).then(
	(buffer) => `data:image/png;base64,${buffer.toString('base64')}`
);

export interface DocsSocialImagePage {
	[key: string]: string;
	description: string;
	path: string;
	slug: string;
	title: string;
}

export function getDocsSocialImagePath(slug: string): string {
	return slug ? `/og/${slug}.png` : '/og/index.png';
}

export function getSocialImageAlt(title: string): string {
	return `${formatSocialTitle(title)} social preview`;
}

export function formatSocialTitle(title: string): string {
	return title === siteName ? siteName : `${title} | ${siteName}`;
}

export async function renderSocialImage(page: Pick<DocsSocialImagePage, 'description' | 'slug' | 'title'>) {
	const walletUiLogoDataUrl = await walletUiLogoDataUrlPromise;
	const title = formatSocialTitle(page.title);
	const description = page.description || siteDescription;
	const sectionLabel = getSectionLabel(page.slug);
	const hrefLabel = page.slug ? `wallet-ui.dev/${page.slug}` : 'wallet-ui.dev';
	const titleLines = wrapText(title, 28, maxTitleLines);
	const descriptionLines = wrapText(description, 48, maxDescriptionLines);
	const titleText = renderLines(titleLines, 116, 236, 68, '#eff6ff', '700');
	const descriptionStartY = 236 + titleLines.length * 78 + 18;
	const descriptionText = renderLines(
		descriptionLines,
		116,
		descriptionStartY,
		34,
		'#dbe7f5',
		'400'
	);
	const descriptionBlockHeight = descriptionLines.length * 44;
	const footerY = Math.max(492, Math.min(530, descriptionStartY + descriptionBlockHeight + 44));
	const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${socialImageWidth}" height="${socialImageHeight}" viewBox="0 0 ${socialImageWidth} ${socialImageHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
	<defs>
		<linearGradient id="bg" x1="0" y1="630" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
			<stop stop-color="#C6F4E7" />
			<stop offset="0.48" stop-color="#4E87F8" />
			<stop offset="1" stop-color="#8E52FF" />
		</linearGradient>
		<radialGradient id="washA" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(146 548) rotate(-21.801) scale(580.128 329.623)">
			<stop stop-color="#FFFFFF" stop-opacity="0.34" />
			<stop offset="1" stop-color="#FFFFFF" stop-opacity="0" />
		</radialGradient>
		<radialGradient id="washB" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1012 52) rotate(135.198) scale(408.352 265.987)">
			<stop stop-color="#FFFFFF" stop-opacity="0.18" />
			<stop offset="1" stop-color="#FFFFFF" stop-opacity="0" />
		</radialGradient>
		<pattern id="grid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
			<path d="M48 0H0V48" stroke="rgba(255,255,255,0.14)" stroke-width="1"/>
		</pattern>
	</defs>
	<rect width="${socialImageWidth}" height="${socialImageHeight}" fill="url(#bg)" />
	<rect width="${socialImageWidth}" height="${socialImageHeight}" fill="url(#grid)" opacity="0.58" />
	<rect width="${socialImageWidth}" height="${socialImageHeight}" fill="rgba(8, 14, 28, 0.66)" />
	<circle cx="146" cy="548" r="332" fill="url(#washA)" />
	<circle cx="1012" cy="52" r="248" fill="url(#washB)" />
	<text x="116" y="122" fill="#E8F1FF" font-family="Arial, sans-serif" font-size="22" font-weight="600">Wallet UI Docs</text>
	<text x="312" y="122" fill="#F8FBFF" font-family="Arial, sans-serif" font-size="22" font-weight="600">${escapeXml(sectionLabel)}</text>
	${titleText}
	${descriptionText}
	<text x="116" y="${footerY}" fill="#D4DEEC" font-family="Arial, sans-serif" font-size="24" font-weight="500">${escapeXml(
		hrefLabel
	)}</text>
	<rect x="1000" y="462" width="80" height="80" rx="20" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.18)" />
	<image x="1000" y="462" width="80" height="80" href="${walletUiLogoDataUrl}" preserveAspectRatio="xMidYMid meet" />
</svg>`;

	return sharp(Buffer.from(svg)).png().toBuffer();
}

export function normalizeDocsSlug(slug: string): string {
	if (!slug || slug === 'index' || slug === '/') return '';
	return slug.endsWith('/index') ? slug.slice(0, -6) : slug;
}

function getSectionLabel(slug: string): string {
	if (!slug) return 'Overview';
	const [section] = slug.split('/');
	return section
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function wrapText(value: string, maxCharsPerLine: number, maxLines: number): string[] {
	const words = value.trim().split(/\s+/).filter(Boolean);
	if (!words.length) return [''];

	const lines: string[] = [];
	let currentLine = '';
	let didTruncate = false;

	for (const word of words) {
		const nextLine = currentLine ? `${currentLine} ${word}` : word;
		if (nextLine.length <= maxCharsPerLine) {
			currentLine = nextLine;
			continue;
		}

		if (currentLine) lines.push(currentLine);
		currentLine = word;

		if (lines.length === maxLines - 1) {
			didTruncate = true;
			break;
		}
	}

	if (lines.length < maxLines && currentLine) {
		lines.push(currentLine);
	}

	if (didTruncate) {
		const lastLine = lines[lines.length - 1] ?? '';
		lines[lines.length - 1] = truncateLine(lastLine, maxCharsPerLine);
	}

	return lines.slice(0, maxLines);
}

function truncateLine(value: string, maxCharsPerLine: number): string {
	if (value.length <= maxCharsPerLine - 1) return `${value}...`;
	return `${value.slice(0, Math.max(0, maxCharsPerLine - 4)).trimEnd()}...`;
}

function renderLines(
	lines: string[],
	x: number,
	startY: number,
	lineHeight: number,
	fill: string,
	fontWeight: '400' | '500' | '600' | '700'
) {
	return lines
		.map(
			(line, index) =>
				`<text x="${x}" y="${startY + index * lineHeight}" fill="${fill}" font-family="Arial, sans-serif" font-size="${lineHeight}" font-weight="${fontWeight}">${escapeXml(line)}</text>`
		)
		.join('');
}

function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}
