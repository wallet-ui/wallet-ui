import { AppIdentity } from '@solana-mobile/mobile-wallet-adapter-protocol';

const VALID_URI_SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*:/;

export function assertValidIdentityUri(identity: AppIdentity): void {
    const { uri } = identity;
    if (uri == null || VALID_URI_SCHEME.test(uri)) {
        return;
    }

    throw new Error(
        'Invalid Mobile Wallet Adapter identity.uri: URI schemes must start with a letter and can only contain letters, numbers, plus signs, periods, and hyphens. Use a valid URI such as https://example.com or my-app://app.',
    );
}
