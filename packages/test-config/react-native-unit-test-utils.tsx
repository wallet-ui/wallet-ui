type AsyncStorageModule = {
    getItem: jest.Mock<Promise<string | null>, [string]>;
    removeItem: jest.Mock<Promise<void>, [string]>;
    setItem: jest.Mock<Promise<void>, [string, string]>;
};

export function resetAsyncStorageMock(asyncStorage: AsyncStorageModule) {
    asyncStorage.getItem.mockReset().mockResolvedValue(null);
    asyncStorage.removeItem.mockReset().mockResolvedValue(undefined);
    asyncStorage.setItem.mockReset().mockResolvedValue(undefined);
}
