export type MobileWalletCapability =
    | 'connect'
    | 'disconnect'
    | 'signAndSendTransactions'
    | 'signIn'
    | 'signMessages'
    | 'signTransactions';

export type MobileWalletPlatform = 'android' | 'ios' | 'unsupported';

export const ANDROID_MOBILE_WALLET_CAPABILITIES = Object.freeze([
    'connect',
    'disconnect',
    'signAndSendTransactions',
    'signIn',
    'signMessages',
    'signTransactions',
] as const satisfies readonly MobileWalletCapability[]);

type ReactNativePlatformModule = Readonly<{
    Platform?: Readonly<{
        OS?: string;
    }>;
}>;

export function getMobileWalletPlatform(): MobileWalletPlatform {
    const os = getReactNativePlatformOS();

    if (os === 'android') {
        return 'android';
    }

    if (os === 'ios') {
        return 'ios';
    }

    return 'unsupported';
}

function getReactNativePlatformOS() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports -- React Native is an optional runtime dependency here.
        const reactNative = require('react-native') as ReactNativePlatformModule;
        return reactNative.Platform?.OS;
    } catch {
        return undefined;
    }
}
