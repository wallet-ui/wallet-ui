import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const nanostoresReactPath = require.resolve('@nanostores/react', {
    paths: [path.resolve(__dirname, '../../packages/react-native-web3js')],
});
const solanaKitPath = require.resolve('@solana/kit', {
    paths: [path.resolve(__dirname, '../../packages/core')],
});

export default defineConfig({
    define: {
        __DEV__: 'false',
        __VERSION__: JSON.stringify('0.0.0-test'),
    },
    resolve: {
        alias: [
            { find: '@', replacement: __dirname },
            { find: '@nanostores/react', replacement: nanostoresReactPath },
            {
                find: '@react-native-async-storage/async-storage',
                replacement: path.resolve(__dirname, 'test/mocks/async-storage.js'),
            },
            {
                find: '@solana-mobile/mobile-wallet-adapter-protocol-web3js',
                replacement: path.resolve(__dirname, 'test/mocks/mobile-wallet-adapter-protocol-web3js.js'),
            },
            { find: '@solana/kit', replacement: solanaKitPath },
            { find: /^@solana\/web3\.js$/, replacement: path.resolve(__dirname, 'test/mocks/solana-web3.js') },
            {
                find: '@wallet-ui/core',
                replacement: path.resolve(__dirname, '../../packages/core/dist/index.node.mjs'),
            },
            {
                find: '@wallet-ui/react-native-web3js',
                replacement: path.resolve(__dirname, '../../packages/react-native-web3js/dist/index.node.mjs'),
            },
            { find: /^react$/, replacement: require.resolve('react') },
            { find: 'react/jsx-dev-runtime', replacement: require.resolve('react/jsx-dev-runtime') },
            { find: 'react/jsx-runtime', replacement: require.resolve('react/jsx-runtime') },
            { find: 'react-native', replacement: path.resolve(__dirname, 'test/mocks/react-native.js') },
            {
                find: 'react-native-safe-area-context',
                replacement: path.resolve(__dirname, 'test/mocks/react-native-safe-area-context.js'),
            },
        ],
    },
    test: {
        clearMocks: true,
        deps: {
            optimizer: {
                ssr: {
                    enabled: true,
                    include: ['@nanostores/react'],
                },
            },
        },
        environment: 'node',
        fileParallelism: false,
        globals: true,
        include: ['test/**/*.integration-test.{ts,tsx}'],
        setupFiles: [path.resolve(__dirname, 'test/vitest.setup.js')],
    },
});
