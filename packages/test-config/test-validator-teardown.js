module.exports = async function globalTeardown() {
    globalThis.testValidatorProcess?.kill('SIGTERM');
};
