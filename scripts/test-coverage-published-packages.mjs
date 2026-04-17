#!/usr/bin/env node
/* global console */

import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import coverageLib from 'istanbul-lib-coverage';
import libReport from 'istanbul-lib-report';
import reports from 'istanbul-reports';

const { createCoverageMap } = coverageLib;

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packagesRoot = path.join(repoRoot, 'packages');
const outputRoot = path.join(repoRoot, 'tmp', 'coverage', 'published-packages');
const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const excludedPackageNames = new Set(['@wallet-ui/css', '@wallet-ui/tailwind']);
const coveragePatterns = [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/__typetests__/**',
    '!src/**/test-utils/**',
];
const publishedPackages = getPublishedPackages();
const repositoryCoverageMap = createCoverageMap({});

if (publishedPackages.length === 0) {
    throw new Error(`No published packages were found in ${packagesRoot}.`);
}

rmSync(outputRoot, { force: true, recursive: true });
mkdirSync(outputRoot, { recursive: true });

const results = [];
let hasFailures = false;

for (const pkg of publishedPackages) {
    console.log(`\n==> ${pkg.name}`);
    const result = runCoverageForPackage(pkg);
    results.push(result);

    if (result.status === 'failed') {
        hasFailures = true;
        console.error(`Failed ${pkg.name}: ${result.message}`);
        continue;
    }

    repositoryCoverageMap.merge(result.coverageMap);

    console.log(
        [
            `Completed ${pkg.name}.`,
            `Statements ${formatMetric(result.summary.statements)}.`,
            `Branches ${formatMetric(result.summary.branches)}.`,
            `Functions ${formatMetric(result.summary.functions)}.`,
            `Lines ${formatMetric(result.summary.lines)}.`,
        ].join(' '),
    );
}

if (repositoryCoverageMap.files().length > 0) {
    reports.create('lcovonly').execute(
        libReport.createContext({
            coverageMap: repositoryCoverageMap,
            dir: outputRoot,
        }),
    );
}

writeFileSync(path.join(outputRoot, 'index.html'), createDashboardHtml(results));

console.log(`\nCoverage dashboard: ${path.join(outputRoot, 'index.html')}`);

if (hasFailures) {
    process.exit(1);
}

function createDashboardHtml(results) {
    const rows = results
        .map(result => {
            const packageCell = `<td><code>${escapeHtml(result.name)}</code></td>`;
            const statusCell =
                result.status === 'ok' ? '<td><strong>ok</strong></td>' : `<td><strong>failed</strong></td>`;

            if (result.status !== 'ok') {
                return [
                    '<tr>',
                    packageCell,
                    statusCell,
                    '<td colspan="4">n/a</td>',
                    `<td>${escapeHtml(result.message)}</td>`,
                    '</tr>',
                ].join('');
            }

            return [
                '<tr>',
                packageCell,
                statusCell,
                `<td>${formatMetric(result.summary.statements)}</td>`,
                `<td>${formatMetric(result.summary.branches)}</td>`,
                `<td>${formatMetric(result.summary.functions)}</td>`,
                `<td>${formatMetric(result.summary.lines)}</td>`,
                `<td><a href="./${escapeHtml(result.directoryName)}/index.html">Open report</a></td>`,
                '</tr>',
            ].join('');
        })
        .join('');

    return [
        '<!doctype html>',
        '<html lang="en">',
        '<head>',
        '    <meta charset="utf-8" />',
        '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
        '    <title>Published Package Coverage</title>',
        '    <style>',
        '        :root {',
        '            color-scheme: light;',
        '            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;',
        '        }',
        '        body {',
        '            background: #f7f7f0;',
        '            color: #171717;',
        '            margin: 0;',
        '            padding: 32px;',
        '        }',
        '        main {',
        '            margin: 0 auto;',
        '            max-width: 1120px;',
        '        }',
        '        h1 {',
        '            font-size: 2rem;',
        '            margin: 0 0 12px;',
        '        }',
        '        p {',
        '            line-height: 1.5;',
        '            margin: 0 0 12px;',
        '        }',
        '        table {',
        '            background: #fff;',
        '            border-collapse: collapse;',
        '            border: 1px solid #d4d4d4;',
        '            margin-top: 24px;',
        '            width: 100%;',
        '        }',
        '        th, td {',
        '            border-bottom: 1px solid #e5e5e5;',
        '            padding: 12px 14px;',
        '            text-align: left;',
        '            vertical-align: top;',
        '        }',
        '        th {',
        '            background: #f3f4f6;',
        '        }',
        '        tr:last-child td {',
        '            border-bottom: 0;',
        '        }',
        '        code {',
        '            background: #f3f4f6;',
        '            border-radius: 4px;',
        '            padding: 2px 6px;',
        '        }',
        '        .note {',
        '            color: #525252;',
        '            max-width: 70ch;',
        '        }',
        '    </style>',
        '</head>',
        '<body>',
        '    <main>',
        '        <h1>Published Package Coverage</h1>',
        '        <p class="note">This dashboard includes publishable npm packages under <code>packages/*</code> that have JavaScript or TypeScript coverage targets.</p>',
        '        <table>',
        '            <thead>',
        '                <tr>',
        '                    <th>Package</th>',
        '                    <th>Status</th>',
        '                    <th>Statements</th>',
        '                    <th>Branches</th>',
        '                    <th>Functions</th>',
        '                    <th>Lines</th>',
        '                    <th>Report</th>',
        '                </tr>',
        '            </thead>',
        `            <tbody>${rows}</tbody>`,
        '        </table>',
        '    </main>',
        '</body>',
        '</html>',
    ].join('\n');
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function formatMetric(metric) {
    if (metric.total === 0 || metric.pct === 'Unknown') {
        return 'n/a (0/0)';
    }

    return `${metric.pct}% (${metric.covered}/${metric.total})`;
}

function getPublishedPackages() {
    return readdirSync(packagesRoot, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => {
            const directoryName = entry.name;
            const packageDirectory = path.join(packagesRoot, directoryName);
            const packageJsonPath = path.join(packageDirectory, 'package.json');

            try {
                const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

                if (packageJson.private === true || excludedPackageNames.has(packageJson.name)) {
                    return null;
                }

                return {
                    directoryName,
                    directoryPath: packageDirectory,
                    name: packageJson.name,
                };
            } catch (error) {
                throw new Error(
                    `Failed to read ${packageJsonPath} for ${directoryName}: ${
                        error instanceof Error ? error.message : String(error)
                    }`,
                );
            }
        })
        .filter(packageInfo => packageInfo !== null)
        .sort((a, b) => a.name.localeCompare(b.name));
}

function runCoverageForPackage(pkg) {
    const packageOutputDirectory = path.join(outputRoot, pkg.directoryName);
    const browserCoverageDirectory = path.join(packageOutputDirectory, '_browser-json');
    const nodeCoverageDirectory = path.join(packageOutputDirectory, '_node-json');

    mkdirSync(packageOutputDirectory, { recursive: true });
    mkdirSync(browserCoverageDirectory, { recursive: true });
    mkdirSync(nodeCoverageDirectory, { recursive: true });

    const browserResult = runJestCoverage({
        configPath: path.join(repoRoot, 'packages', 'test-config', 'jest-unit.config.browser.js'),
        coverageDirectory: browserCoverageDirectory,
        pkg,
        runtimeName: 'browser',
    });

    if (!browserResult.ok) {
        return {
            directoryName: pkg.directoryName,
            message: browserResult.message,
            name: pkg.name,
            status: 'failed',
        };
    }

    const nodeResult = runJestCoverage({
        configPath: path.join(repoRoot, 'packages', 'test-config', 'jest-unit.config.node.js'),
        coverageDirectory: nodeCoverageDirectory,
        pkg,
        runtimeName: 'node',
    });

    if (!nodeResult.ok) {
        return {
            directoryName: pkg.directoryName,
            message: nodeResult.message,
            name: pkg.name,
            status: 'failed',
        };
    }

    try {
        const coverageMap = createCoverageMap({});
        coverageMap.merge(readCoverageJson(browserCoverageDirectory));
        coverageMap.merge(readCoverageJson(nodeCoverageDirectory));

        const reportContext = libReport.createContext({
            coverageMap,
            dir: packageOutputDirectory,
        });

        reports.create('html').execute(reportContext);

        return {
            coverageMap,
            directoryName: pkg.directoryName,
            name: pkg.name,
            status: 'ok',
            summary: coverageMap.getCoverageSummary().toJSON(),
        };
    } catch (error) {
        return {
            directoryName: pkg.directoryName,
            message: `failed to merge or render coverage: ${error instanceof Error ? error.message : String(error)}`,
            name: pkg.name,
            status: 'failed',
        };
    }
}

function runJestCoverage({ configPath, coverageDirectory, pkg, runtimeName }) {
    console.log(`   ${runtimeName}: running coverage`);

    const result = spawnSync(
        pnpmCommand,
        [
            '--dir',
            pkg.directoryPath,
            'exec',
            'jest',
            '-c',
            configPath,
            '--coverage',
            '--coverageDirectory',
            coverageDirectory,
            '--coverageReporters=json',
            '--rootDir',
            '.',
            '--silent',
            ...coveragePatterns.flatMap(pattern => ['--collectCoverageFrom', pattern]),
        ],
        {
            cwd: repoRoot,
            stdio: 'inherit',
        },
    );

    if (result.status !== 0) {
        return {
            message: `${runtimeName} coverage exited with code ${result.status ?? 1}`,
            ok: false,
        };
    }

    return { ok: true };
}

function readCoverageJson(coverageDirectory) {
    return JSON.parse(readFileSync(path.join(coverageDirectory, 'coverage-final.json'), 'utf8'));
}
