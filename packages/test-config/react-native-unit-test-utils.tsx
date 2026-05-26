import type { Mock } from 'vitest';

type AsyncStorageModule = {
    getItem: Mock<(key: string) => Promise<string | null>>;
    removeItem: Mock<(key: string) => Promise<void>>;
    setItem: Mock<(key: string, value: string) => Promise<void>>;
};

export function resetAsyncStorageMock(asyncStorage: AsyncStorageModule) {
    asyncStorage.getItem.mockReset().mockResolvedValue(null);
    asyncStorage.removeItem.mockReset().mockResolvedValue(undefined);
    asyncStorage.setItem.mockReset().mockResolvedValue(undefined);
}
