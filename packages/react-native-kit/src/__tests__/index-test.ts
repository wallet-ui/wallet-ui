import { createAuthorizationStore } from '../authorization-store';
import { convertSignInResult } from '../convert-sign-in-result';
import * as reactNativeKit from '../index';
import { MobileWalletProvider, MobileWalletProviderContext } from '../mobile-wallet-provider';
import { useAuthorization } from '../use-authorization';
import { useMobileWallet } from '../use-mobile-wallet';

jest.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        getItem: jest.fn(),
        removeItem: jest.fn(),
        setItem: jest.fn(),
    },
}));

describe('index', () => {
    it('re-exports the local runtime surface from the barrel', () => {
        expect.assertions(6);

        expect(reactNativeKit.MobileWalletProvider).toBe(MobileWalletProvider);
        expect(reactNativeKit.MobileWalletProviderContext).toBe(MobileWalletProviderContext);
        expect(reactNativeKit.convertSignInResult).toBe(convertSignInResult);
        expect(reactNativeKit.createAuthorizationStore).toBe(createAuthorizationStore);
        expect(reactNativeKit.useAuthorization).toBe(useAuthorization);
        expect(reactNativeKit.useMobileWallet).toBe(useMobileWallet);
    });
});
