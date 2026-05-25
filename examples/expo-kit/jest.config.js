/* global __dirname */

const path = require('path');

const solanaKitPath = require.resolve('@solana/kit', {
    paths: [path.resolve(__dirname, '../../packages/core')],
});

module.exports = {
    clearMocks: true,
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^@react-native-async-storage/async-storage$': '<rootDir>/test/mocks/async-storage.js',
        '^@solana/kit$': solanaKitPath,
        '^@wallet-ui/core$': path.resolve(__dirname, '../../packages/core/dist/index.node.cjs'),
        '^@wallet-ui/react-native-kit$': path.resolve(__dirname, '../../packages/react-native-kit/dist/index.node.cjs'),
        '^react$': require.resolve('react'),
        '^react/jsx-dev-runtime$': require.resolve('react/jsx-dev-runtime'),
        '^react/jsx-runtime$': require.resolve('react/jsx-runtime'),
        '^react-native$': '<rootDir>/test/mocks/react-native.js',
        '^react-native-safe-area-context$': '<rootDir>/test/mocks/react-native-safe-area-context.js',
    },
    resolver: path.resolve(__dirname, 'test/jest-resolver.js'),
    setupFilesAfterEnv: [path.resolve(__dirname, 'test/jest.setup.js')],
    testEnvironment: 'node',
    testMatch: ['<rootDir>/test/**/*.integration-test.ts?(x)'],
    transformIgnorePatterns: ['/node_modules/(?!.*(?:@nanostores|nanostores|uuid)/)', '\\.pnp\\.[^\\/]+$'],
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
