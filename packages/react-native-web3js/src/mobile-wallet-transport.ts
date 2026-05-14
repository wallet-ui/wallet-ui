import { WalletUiUnsupportedPlatformError } from './errors';
import {
    ANDROID_MOBILE_WALLET_CAPABILITIES,
    getMobileWalletPlatform,
    type MobileWalletCapability,
    type MobileWalletPlatform,
} from './mobile-wallet-platform';

type AndroidTransact = (typeof import('@solana-mobile/mobile-wallet-adapter-protocol-web3js'))['transact'];
type AndroidWallet = Parameters<Parameters<AndroidTransact>[0]>[0];

export interface MobileWalletTransport {
    capabilities: readonly MobileWalletCapability[];
    isSupported: boolean;
    platform: MobileWalletPlatform;
    transact<T>(callback: (wallet: AndroidWallet) => Promise<T>): Promise<T>;
}

export function createMobileWalletTransport(): MobileWalletTransport {
    const platform = getMobileWalletPlatform();

    if (platform === 'android') {
        return {
            capabilities: ANDROID_MOBILE_WALLET_CAPABILITIES,
            isSupported: true,
            platform,
            transact: async callback => await getAndroidTransact()(callback),
        };
    }

    return {
        capabilities: [],
        isSupported: false,
        platform,
        transact: () => Promise.reject(new WalletUiUnsupportedPlatformError(platform)),
    };
}

function getAndroidTransact(): AndroidTransact {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Android MWA must stay lazily loaded.
    const mobileWalletAdapter = require('@solana-mobile/mobile-wallet-adapter-protocol-web3js') as {
        transact: AndroidTransact;
    };

    return mobileWalletAdapter.transact;
}
