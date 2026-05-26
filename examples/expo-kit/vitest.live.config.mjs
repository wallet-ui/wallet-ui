import { mergeConfig } from 'vitest/config';

import baseConfig from './vitest.config.mjs';

export default mergeConfig(baseConfig, {
    test: {
        include: ['test/**/*.live-test.{ts,tsx}'],
        testTimeout: 60_000,
    },
});
