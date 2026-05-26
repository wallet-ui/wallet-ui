import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { commonTestConfig, createGlobalDefines } from './vitest.config.common.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    define: createGlobalDefines({
        __BROWSER__: false,
        __NODEJS__: true,
        __REACTNATIVE__: false,
    }),
    resolve: {
        alias: {
            '@nanostores/persistent': path.resolve(__dirname, '../core/node_modules/@nanostores/persistent/index.js'),
            '@wallet-ui/core': path.resolve(__dirname, '../core/dist/index.node.cjs'),
        },
    },
    test: {
        ...commonTestConfig,
        environment: 'node',
        exclude: [...commonTestConfig.exclude, 'src/**/*-test.browser.{js,jsx,ts,tsx}'],
        name: 'Unit Test (Node)',
        setupFiles: [...commonTestConfig.setupFiles, path.resolve(__dirname, 'setup-node-globals.ts')],
    },
});
