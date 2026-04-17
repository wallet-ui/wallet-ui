#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const [packageName] = process.argv.slice(2);

if (!packageName) {
    throw new Error('Usage: node ../../scripts/test-expo-native-entry-smoke.mjs <workspace-package>');
}

const exampleDir = process.cwd();
const exampleName = path.basename(exampleDir);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspaceName = packageName.replace('@wallet-ui/', '');

const nativeEntryPath = path.join(repoRoot, 'packages', workspaceName, 'dist', 'index.native.mjs');
const nodeEntryPath = path.join(repoRoot, 'packages', workspaceName, 'dist', 'index.node.cjs');

if (!existsSync(nativeEntryPath) || !existsSync(nodeEntryPath)) {
    throw new Error(
        [
            `Missing prebuilt workspace artifacts for ${packageName}.`,
            `Expected ${nativeEntryPath} and ${nodeEntryPath}.`,
            'Run `pnpm build` from the repository root first.',
            'This is a workspace build prerequisite failure, not a native-entry regression.',
        ].join('\n')
    );
}

const outputDir = mkdtempSync(path.join(tmpdir(), `${exampleName}-native-entry-`));
const exportResult = spawnSync(
    'pnpm',
    ['exec', 'expo', 'export', '--output-dir', outputDir, '--platform', 'ios', '--source-maps', 'external'],
    {
        cwd: exampleDir,
        stdio: 'inherit',
    }
);

if (exportResult.status !== 0) {
    process.exit(exportResult.status ?? 1);
}

const bundleDir = path.join(outputDir, '_expo', 'static', 'js', 'ios');
const sourceMapName = readdirSync(bundleDir)
    .filter(fileName => fileName.endsWith('.map'))
    .sort()[0];

if (!sourceMapName) {
    throw new Error(`No iOS source map was generated in ${bundleDir}.`);
}

const sourceMap = JSON.parse(readFileSync(path.join(bundleDir, sourceMapName), 'utf8'));
const sources = Array.isArray(sourceMap.sources) ? sourceMap.sources : [];
const distSources = sources.filter(sourcePath => sourcePath.includes(`/packages/${workspaceName}/dist/index.`));
const nativeEntrySuffix = `/packages/${workspaceName}/dist/index.native.mjs`;
const nodeEntrySuffix = `/packages/${workspaceName}/dist/index.node.cjs`;

if (distSources.some(sourcePath => sourcePath.includes(nodeEntrySuffix))) {
    throw new Error(
        [
            `Expected ${packageName} to resolve its native entrypoint while bundling ${exampleName}.`,
            `Found the Node bundle in the Expo iOS source map: ${nodeEntrySuffix}`,
        ].join('\n')
    );
}

if (!distSources.some(sourcePath => sourcePath.includes(nativeEntrySuffix))) {
    throw new Error(
        [
            `Expected ${packageName} to resolve ${nativeEntrySuffix} while bundling ${exampleName}.`,
            'Resolved dist sources:',
            distSources.length > 0 ? distSources.join('\n') : '(none)',
        ].join('\n')
    );
}

console.log(`Verified ${packageName} resolved ${nativeEntrySuffix} while bundling ${exampleName}.`);
