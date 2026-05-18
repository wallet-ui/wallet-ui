const config = {
    displayName: {
        color: 'cyanBright',
        name: 'ESLint',
    },
    runner: 'eslint',
    testMatch: ['<rootDir>src/**/*.{ts,tsx}'],
    testPathIgnorePatterns: ['README.md'],
};

export default config;
