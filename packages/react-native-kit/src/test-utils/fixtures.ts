import {
    Account as AuthorizedAccount,
    AuthorizationResult,
    SignInResult,
} from '@solana-mobile/mobile-wallet-adapter-protocol';

import type { Cache } from '../cache';
import type { SignInOutput } from '../convert-sign-in-result';
import type { Account, WalletAuthorization } from '../use-authorization';

type CacheMocks = Cache<WalletAuthorization | undefined> & {
    clear: jest.Mock;
    get: jest.Mock;
    set: jest.Mock;
};

export const FIRST_ADDRESS = '11111111111111111111111111111111';
export const FIRST_ADDRESS_BASE64 = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
export const ICON = 'data:image/svg+xml;base64,PHN2Zy8+';
export const SECOND_ADDRESS = 'Stake11111111111111111111111111111111111111';
export const SECOND_ADDRESS_BASE64 = 'BqHYF5E3VCqYNDe9/ip6slV/U1yKeHIraKSdwAAAAAA=';
export const SIGNATURE_BASE64 = 'c2lnbmF0dXJl';
export const SIGNED_MESSAGE_BASE64 = 'c2lnbmVkLW1lc3NhZ2U=';

export function createAuthorizedAccount({
    address = FIRST_ADDRESS_BASE64,
    icon,
    label,
}: {
    address?: string;
    icon?: typeof ICON;
    label?: string;
} = {}): AuthorizedAccount {
    return {
        address,
        icon,
        label,
    };
}

export function createAuthorizationResult({
    accounts = [createAuthorizedAccount()],
    authToken = 'next-auth-token',
    signInResult,
}: {
    accounts?: AuthorizedAccount[];
    authToken?: string;
    signInResult?: SignInResult;
} = {}): AuthorizationResult {
    return {
        accounts,
        auth_token: authToken,
        sign_in_result: signInResult,
        wallet_uri_base: 'https://wallet.example',
    };
}

export function createCache({
    clear = jest.fn().mockResolvedValue(undefined),
    get = jest.fn().mockResolvedValue(undefined),
    set = jest.fn().mockResolvedValue(undefined),
}: {
    clear?: jest.Mock;
    get?: jest.Mock;
    set?: jest.Mock;
} = {}): CacheMocks {
    return {
        clear,
        get,
        set,
    };
}

export function createExpectedAccount({
    address = FIRST_ADDRESS,
    addressBase64 = FIRST_ADDRESS_BASE64,
    icon,
    label = '11111111..11111111',
}: {
    address?: string;
    addressBase64?: string;
    icon?: typeof ICON;
    label?: string;
} = {}): Account {
    return {
        address: address as Account['address'],
        addressBase64,
        icon,
        label,
    };
}

export function createExpectedAuthorization({
    accounts = [createExpectedAccount()],
    authToken = 'cached-auth-token',
    selectedAccount = accounts[0],
}: {
    accounts?: Account[];
    authToken?: string;
    selectedAccount?: Account;
} = {}): WalletAuthorization {
    return {
        accounts,
        authToken,
        selectedAccount,
    };
}

export function createExpectedSignInOutput({
    account = createExpectedAccount(),
    signInResult = createSignInResult(),
}: {
    account?: Account;
    signInResult?: SignInResult;
} = {}): SignInOutput {
    return {
        account,
        signature: new TextEncoder().encode(signInResult.signature),
        signedMessage: new TextEncoder().encode(signInResult.signed_message),
    };
}

export function createSignInResult(): SignInResult {
    return {
        address: FIRST_ADDRESS_BASE64,
        signature: SIGNATURE_BASE64,
        signed_message: SIGNED_MESSAGE_BASE64,
    };
}
