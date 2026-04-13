import { createAuthorizationStore } from '../authorization-store';
import { convertSignInResult } from '../convert-sign-in-result';
import * as reactNativeWeb3js from '../index';
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

        expect(reactNativeWeb3js.MobileWalletProvider).toBe(MobileWalletProvider);
        expect(reactNativeWeb3js.MobileWalletProviderContext).toBe(MobileWalletProviderContext);
        expect(reactNativeWeb3js.convertSignInResult).toBe(convertSignInResult);
        expect(reactNativeWeb3js.createAuthorizationStore).toBe(createAuthorizationStore);
        expect(reactNativeWeb3js.useAuthorization).toBe(useAuthorization);
        expect(reactNativeWeb3js.useMobileWallet).toBe(useMobileWallet);
    });
});
