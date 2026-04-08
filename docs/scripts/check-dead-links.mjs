import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const distDir = path.resolve('dist');
const clientDir = path.join(distDir, 'client');
const hrefPattern = /<a\b[^>]*\bhref=(["'])(.*?)\1/gi;
const ignoredProtocols = /^(?:[a-z]+:|\/\/)/i;

async function walkHtmlFiles(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const entryPath = path.join(dir, entry.name);
			if (entry.isDirectory()) return walkHtmlFiles(entryPath);
			return entry.isFile() && entry.name.endsWith('.html') ? [entryPath] : [];
		})
	);

	return files.flat();
}

function toRoutePath(filePath, htmlRootDir) {
	const relPath = path.relative(htmlRootDir, filePath).split(path.sep).join('/');
	if (relPath === 'index.html') return '/';
	if (relPath.endsWith('/index.html')) return `/${relPath.slice(0, -'index.html'.length)}`;
	return `/${relPath}`;
}

async function pathExists(targetPath) {
	try {
		await stat(targetPath);
		return true;
	} catch {
		return false;
	}
}

async function resolveHtmlRootDir() {
	if (await pathExists(clientDir)) {
		return clientDir;
	}

	return distDir;
}

async function routeExists(pathname, htmlRootDir) {
	const trimmed = pathname.replace(/\/+$/, '');
	const candidates = pathname === '/'
		? [path.join(htmlRootDir, 'index.html')]
		: [
				path.join(htmlRootDir, pathname, 'index.html'),
				path.join(htmlRootDir, `${trimmed}.html`),
				path.join(htmlRootDir, trimmed),
			];

	for (const candidate of candidates) {
		if (await pathExists(candidate)) return true;
	}

	return false;
}

async function main() {
	if (!(await pathExists(distDir))) {
		console.error(`dist directory not found at ${distDir}`);
		process.exit(1);
	}

	const htmlRootDir = await resolveHtmlRootDir();
	const htmlFiles = await walkHtmlFiles(htmlRootDir);
	const failures = [];

	for (const filePath of htmlFiles) {
		const html = await readFile(filePath, 'utf8');
		const pageUrl = new URL(toRoutePath(filePath, htmlRootDir), 'https://example.test');

		for (const match of html.matchAll(hrefPattern)) {
			const href = match[2];
			if (!href || href.startsWith('#') || ignoredProtocols.test(href)) continue;

			const resolved = new URL(href, pageUrl);
			if (!(await routeExists(resolved.pathname, htmlRootDir))) {
				failures.push({
					page: pageUrl.pathname,
					href,
					resolved: resolved.pathname,
				});
			}
		}
	}

	if (failures.length > 0) {
		console.error(`Found ${failures.length} dead internal link${failures.length === 1 ? '' : 's'}:`);
		for (const failure of failures) {
			console.error(`${failure.page} -> ${failure.href} (resolved: ${failure.resolved})`);
		}
		process.exit(1);
	}

	console.log(`Checked ${htmlFiles.length} HTML files. No dead internal links found.`);
}

await main();
