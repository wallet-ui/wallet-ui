/* global beforeEach, jest */

const { Buffer } = require('buffer');
const crypto = require('node:crypto');
if (typeof globalThis.Buffer === 'undefined') {
    Object.defineProperty(globalThis, 'Buffer', {
        value: Buffer,
        writable: true,
    });
}
if (typeof globalThis.crypto === 'undefined') {
    Object.defineProperty(globalThis, 'crypto', {
        value: crypto.webcrypto,
        writable: true,
    });
}
if (typeof globalThis.crypto.subtle === 'undefined') {
    Object.defineProperty(globalThis.crypto, 'subtle', {
        value: crypto.webcrypto.subtle,
    });
}

beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    globalThis.__DEV__ = false;
    globalThis.__VERSION__ = '0.0.0-test';
    jest.restoreAllMocks();
});
