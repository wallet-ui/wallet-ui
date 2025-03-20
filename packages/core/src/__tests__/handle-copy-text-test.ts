import { handleCopyText } from '../handle-copy-text';

function polyfillNavigator(hasClipboard: boolean, writeTextSpy: jest.Mock) {
    const clipboard = hasClipboard ? { writeText: writeTextSpy } : undefined;
    Object.defineProperty(globalThis, 'navigator', {
        value: {
            clipboard,
        },
        writable: true,
    });
}

describe('handleCopyText', () => {
    let writeTextSpy: jest.Mock;

    beforeEach(() => {
        writeTextSpy = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should call writeText with provided text when clipboard API is available', () => {
        // Arrange
        polyfillNavigator(true, writeTextSpy);

        // Act
        handleCopyText('test text');

        // Assert
        expect(writeTextSpy).toHaveBeenCalledWith('test text');
        expect(writeTextSpy).toHaveBeenCalledTimes(1);
    });

    it('should do nothing if clipboard API is not available', () => {
        // Arrange - Override the default setup to disable clipboard
        polyfillNavigator(false, writeTextSpy);

        // Act
        handleCopyText('test text');

        // Assert - Since there's no clipboard API, it should not throw
        expect(true).toBe(true);
    });

    it('should do nothing if text is undefined', () => {
        // Arrange
        polyfillNavigator(true, writeTextSpy);

        // Act
        handleCopyText(undefined);

        // Assert
        expect(writeTextSpy).not.toHaveBeenCalled();
    });
});
