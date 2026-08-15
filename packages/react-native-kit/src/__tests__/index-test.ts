import { createAuthorizationStore } from '../authorization-store';
import { convertSignInResult } from '../convert-sign-in-result';
import * as reactNativeKit from '../index';
import { mobileWallet } from '../mobile-wallet';
import { MobileWalletProvider, MobileWalletProviderContext } from '../mobile-wallet-provider';
import { useAuthorization } from '../use-authorization';
import { useMobileWallet } from '../use-mobile-wallet';

vi.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        getItem: vi.fn(),
        removeItem: vi.fn(),
        setItem: vi.fn(),
    },
}));

describe('index', () => {
    it('re-exports the local runtime surface from the barrel', () => {
        expect.assertions(7);

        expect(reactNativeKit.MobileWalletProvider).toBe(MobileWalletProvider);
        expect(reactNativeKit.MobileWalletProviderContext).toBe(MobileWalletProviderContext);
        expect(reactNativeKit.convertSignInResult).toBe(convertSignInResult);
        expect(reactNativeKit.createAuthorizationStore).toBe(createAuthorizationStore);
        expect(reactNativeKit.mobileWallet).toBe(mobileWallet);
        expect(reactNativeKit.useAuthorization).toBe(useAuthorization);
        expect(reactNativeKit.useMobileWallet).toBe(useMobileWallet);
    });
});
