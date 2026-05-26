globalThis.__BROWSER__ = true;
globalThis.__NODEJS__ = false;
globalThis.__REACTNATIVE__ = false;
globalThis.Uint8Array = Uint8Array;

beforeEach(() => {
    globalThis.__BROWSER__ = true;
    globalThis.__NODEJS__ = false;
    globalThis.__REACTNATIVE__ = false;
    globalThis.Uint8Array = Uint8Array;
});
