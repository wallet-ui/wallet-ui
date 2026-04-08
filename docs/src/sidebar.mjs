import fs from 'node:fs';
import path from 'node:path';

const docsRoot = path.join(process.cwd(), 'src/content/docs');

function readJson(relativePath) {
    return JSON.parse(fs.readFileSync(path.join(docsRoot, relativePath), 'utf8'));
}

function parseTitle(relativeSlug) {
    const filePath = path.join(docsRoot, `${relativeSlug}.mdx`);
    const source = fs.readFileSync(filePath, 'utf8');
    const frontmatter = source.match(/^---\s*\n([\s\S]*?)\n---/);
    const title = frontmatter?.[1].match(/^title:\s*(.+)$/m);
    return title ? title[1].trim().replace(/^['"]|['"]$/g, '') : relativeSlug.split('/').at(-1);
}

function routeSlug(relativeSlug) {
    return relativeSlug.replace(/\/index$/, '');
}

function pageExists(relativeSlug) {
    return fs.existsSync(path.join(docsRoot, `${relativeSlug}.mdx`));
}

function toLinkItem(relativeSlug) {
    return {
        label: parseTitle(relativeSlug),
        slug: routeSlug(relativeSlug),
    };
}

function buildSection(sectionSlug) {
    const meta = readJson(`${sectionSlug}/meta.json`);
    const items = [];
    let currentGroup = null;

    if (meta.root && pageExists(`${sectionSlug}/index`)) {
        items.push({ label: 'Overview', slug: sectionSlug });
    }

    for (const entry of meta.pages) {
        const heading = entry.match(/^---(.+)---$/);
        if (heading) {
            currentGroup = { label: heading[1], items: [] };
            items.push(currentGroup);
            continue;
        }

        if (meta.root && entry === 'index') {
            continue;
        }

        const relativeSlug = `${sectionSlug}/${entry}`;
        if (!pageExists(relativeSlug)) continue;

        const linkItem = toLinkItem(relativeSlug);
        if (currentGroup) {
            currentGroup.items.push(linkItem);
        } else {
            items.push(linkItem);
        }
    }

    return {
        label: meta.title,
        items: items.filter(item => !('items' in item) || item.items.length > 0),
    };
}

const rootMeta = readJson('meta.json');

export const docsSidebar = [
    {
        label: 'Start Here',
        items: [{ label: 'Overview', slug: '' }],
    },
    ...rootMeta.pages.map(buildSection),
];
