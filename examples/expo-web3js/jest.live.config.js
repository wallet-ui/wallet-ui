const baseConfig = require('./jest.config');

module.exports = {
    ...baseConfig,
    testMatch: ['<rootDir>/test/**/*.live-test.ts?(x)'],
    testTimeout: 60_000,
};
