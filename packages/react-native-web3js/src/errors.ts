export class WalletUiFeatureUnavailableError extends Error {
    override name = 'WalletUiFeatureUnavailableError';
}

export class WalletUiUnsupportedPlatformError extends Error {
    override name = 'WalletUiUnsupportedPlatformError';

    constructor(platform: string) {
        super(`Mobile wallet operations are not supported on ${getPlatformLabel(platform)}.`);
    }
}

export class WalletUiWalletUnavailableError extends Error {
    override name = 'WalletUiWalletUnavailableError';
}

function getPlatformLabel(platform: string) {
    return platform === 'ios' ? 'iOS' : platform;
}
