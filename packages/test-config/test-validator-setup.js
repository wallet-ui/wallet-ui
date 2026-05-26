const { spawn } = require('node:child_process');

const HEALTH_URL = 'http://127.0.0.1:8899/health';
const START_TIMEOUT_MS = 50_000;

module.exports = async function globalSetup() {
    globalThis.testValidatorProcess = spawn('../../scripts/start-shared-test-validator.sh', {
        shell: true,
        stdio: 'inherit',
    });
    await waitForValidator();
};

async function waitForValidator() {
    const startedAt = Date.now();
    while (Date.now() - startedAt < START_TIMEOUT_MS) {
        try {
            const response = await fetch(HEALTH_URL);
            if (response.ok) {
                return;
            }
        } catch {
            // Keep waiting until the validator responds or the timeout expires.
        }
        await new Promise(resolve => setTimeout(resolve, 250));
    }
    throw new Error(`Timed out waiting for Solana test validator at ${HEALTH_URL}`);
}
