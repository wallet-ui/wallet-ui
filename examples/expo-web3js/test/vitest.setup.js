/* global beforeEach, vi */

if (!process.env.EXPO_OS) {
    process.env.EXPO_OS = 'ios';
}

if (!process.env.EXPO_PUBLIC_APP_SCHEME) {
    process.env.EXPO_PUBLIC_APP_SCHEME = 'wallet-ui-example-expo-web3js';
}

if (!process.env.EXPO_PUBLIC_APP_VERSION) {
    process.env.EXPO_PUBLIC_APP_VERSION = '2.0.0';
}

if (!process.env.EXPO_PUBLIC_BUILD_NUMBER) {
    process.env.EXPO_PUBLIC_BUILD_NUMBER = '123';
}

beforeEach(() => {
    globalThis.__DEV__ = false;
    globalThis.__VERSION__ = '0.0.0-test';
    vi.restoreAllMocks();
});
