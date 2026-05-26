import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    test: {
        projects: [
            path.resolve(__dirname, 'vitest.config.browser.mjs'),
            path.resolve(__dirname, 'vitest.config.node.mjs'),
        ],
    },
});
