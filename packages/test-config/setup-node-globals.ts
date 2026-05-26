globalThis.__BROWSER__ = false;
globalThis.__NODEJS__ = true;
globalThis.__REACTNATIVE__ = false;

beforeEach(() => {
    globalThis.__BROWSER__ = false;
    globalThis.__NODEJS__ = true;
    globalThis.__REACTNATIVE__ = false;
});
