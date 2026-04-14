/* global __dirname */

const path = require('path');

module.exports = {
    clearMocks: true,
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^@react-native-async-storage/async-storage$': '<rootDir>/test/mocks/async-storage.js',
        '^@solana/kit$': require.resolve('@solana/kit'),
        '^@wallet-ui/core$': path.resolve(__dirname, '../../packages/core/dist/index.node.cjs'),
        '^@wallet-ui/react-native-web3js$': path.resolve(__dirname, '../../packages/react-native-web3js/dist/index.node.cjs'),
        '^react$': require.resolve('react'),
        '^react/jsx-dev-runtime$': require.resolve('react/jsx-dev-runtime'),
        '^react/jsx-runtime$': require.resolve('react/jsx-runtime'),
        '^react-native$': '<rootDir>/test/mocks/react-native.js',
        '^react-native-safe-area-context$': '<rootDir>/test/mocks/react-native-safe-area-context.js',
    },
    setupFilesAfterEnv: [
        path.resolve(__dirname, 'test/jest.setup.js'),
    ],
    testEnvironment: 'node',
    testMatch: ['<rootDir>/test/**/*.integration-test.ts?(x)'],
    transformIgnorePatterns: [
        '/node_modules/(?!.*(?:@nanostores|nanostores|uuid)/)',
        '\\.pnp\\.[^\\/]+$',
    ],
    transform: {
        '^.+\\.(ts|js)x?$': [
            '@swc/jest',
            {
                jsc: {
                    parser: {
                        syntax: 'typescript',
                        tsx: true,
                    },
                    target: 'es2020',
                    transform: {
                        react: {
                            runtime: 'automatic',
                        },
                    },
                },
            },
        ],
    },
};
