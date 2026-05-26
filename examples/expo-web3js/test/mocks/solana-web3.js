const actual = require('@solana/web3.js/lib/index.cjs.js');

function Connection(...args) {
    if (globalThis.__walletUiMockConnectionConstructor) {
        return globalThis.__walletUiMockConnectionConstructor(...args);
    }

    return new actual.Connection(...args);
}

Connection.prototype = actual.Connection.prototype;

module.exports = {
    ...actual,
    Connection,
};
