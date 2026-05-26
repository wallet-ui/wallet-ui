module.exports = {
    transact: (...args) => globalThis.__walletUiMockTransact(...args),
};
