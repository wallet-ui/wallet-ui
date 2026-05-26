import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const commonTestConfig = {
    exclude: ['src/**/__setup__.ts'],
    globals: true,
    include: ['src/**/*-test.{js,jsx,ts,tsx}'],
    mockReset: true,
    restoreMocks: true,
    setupFiles: [
        path.resolve(__dirname, 'setup-dev-mode.ts'),
        path.resolve(__dirname, 'setup-define-version-constant.ts'),
        path.resolve(__dirname, 'setup-webcrypto.ts'),
    ],
};

export function createGlobalDefines(values) {
    return Object.fromEntries(
        Object.entries({
            __DEV__: false,
            __VERSION__: '0.0.0-test',
            ...values,
        }).map(([key, value]) => [key, JSON.stringify(value)]),
    );
}
