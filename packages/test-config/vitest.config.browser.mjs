import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { commonTestConfig, createGlobalDefines } from './vitest.config.common.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const clientOptimizerIncludes = [];
try {
    const packageJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'));
    if (packageJson.dependencies?.['@solana/kit']) {
        clientOptimizerIncludes.push('@solana/kit');
    }
} catch {
    // This package does not depend on Solana Kit.
}

export default defineConfig({
    define: createGlobalDefines({
        __BROWSER__: true,
        __NODEJS__: false,
        __REACTNATIVE__: false,
    }),
    resolve: {
        alias: {
            '@nanostores/persistent': path.resolve(__dirname, '../core/node_modules/@nanostores/persistent/index.js'),
            '@wallet-ui/core': path.resolve(__dirname, '../core/dist/index.browser.mjs'),
            uuid: require.resolve('uuid'),
        },
        conditions: ['browser'],
    },
    test: {
        ...commonTestConfig,
        ...(clientOptimizerIncludes.length
            ? {
                  deps: {
                      optimizer: {
                          client: {
                              enabled: true,
                              include: clientOptimizerIncludes,
                          },
                      },
                  },
              }
            : {}),
        environment: 'jsdom',
        exclude: [...commonTestConfig.exclude, 'src/**/*-test.node.{js,jsx,ts,tsx}'],
        name: 'Unit Test (Browser)',
        setupFiles: [
            ...commonTestConfig.setupFiles,
            path.resolve(__dirname, 'setup-browser-globals.ts'),
            path.resolve(__dirname, 'setup-secure-context.ts'),
            path.resolve(__dirname, 'setup-text-encoder.ts'),
            path.resolve(__dirname, 'setup-web-buffer-global.ts'),
            path.resolve(__dirname, 'setup-whatwg-fetch.ts'),
        ],
    },
});
