import { Buffer } from 'buffer';

import { convertSignInResult } from '../convert-sign-in-result';
import { getAccountFromAuthorizedAccount } from '../get-account-from-authorized-account';
import { getAuthorizationFromAuthorizationResult } from '../get-authorization-from-authorization-result';
import {
    createAuthorizationResult,
    createAuthorizedAccount,
    createExpectedAccount,
    createExpectedAuthorization,
    createExpectedSignInOutput,
    createSignInResult,
    FIRST_ADDRESS,
    FIRST_ADDRESS_BASE64,
    ICON,
    SECOND_ADDRESS,
    SECOND_ADDRESS_BASE64,
} from '../test-utils/fixtures';

describe('react-native-web3js helpers', () => {
    beforeEach(() => {
        setupTestEnvironment();
    });

    it('converts an authorized account into a wallet-ui account', () => {
        expect.assertions(1);
        const authorizedAccount = createAuthorizedAccount({
            address: FIRST_ADDRESS_BASE64,
            icon: ICON,
            label: 'Primary',
        });
        const account = getAccountFromAuthorizedAccount(authorizedAccount);

        expect(account).toEqual(
            createExpectedAccount({
                address: FIRST_ADDRESS,
                addressBase64: FIRST_ADDRESS_BASE64,
                icon: ICON,
                label: 'Primary',
            }),
        );
    });

    it('falls back to the first account when the previously selected account is no longer authorized', () => {
        expect.assertions(1);
        const previousSelection = getAccountFromAuthorizedAccount(
            createAuthorizedAccount({
                address: FIRST_ADDRESS_BASE64,
            }),
        );
        const authorization = getAuthorizationFromAuthorizationResult(
            createAuthorizationResult({
                accounts: [
                    createAuthorizedAccount({
                        address: SECOND_ADDRESS_BASE64,
                    }),
                ],
            }),
            previousSelection,
        );

        expect(authorization).toEqual(
            createExpectedAuthorization({
                accounts: [
                    createExpectedAccount({
                        address: SECOND_ADDRESS,
                        addressBase64: SECOND_ADDRESS_BASE64,
                        label: 'Stake111..11111111',
                    }),
                ],
                authToken: 'next-auth-token',
            }),
        );
    });

    it('keeps the previous selection when it is still present in the authorization result', () => {
        expect.assertions(2);
        const previousSelection = getAccountFromAuthorizedAccount(
            createAuthorizedAccount({
                address: SECOND_ADDRESS_BASE64,
                label: 'Stake account',
            }),
        );
        const authorization = getAuthorizationFromAuthorizationResult(
            createAuthorizationResult({
                accounts: [
                    createAuthorizedAccount({
                        address: FIRST_ADDRESS_BASE64,
                    }),
                    createAuthorizedAccount({
                        address: SECOND_ADDRESS_BASE64,
                        label: 'Stake account',
                    }),
                ],
            }),
            previousSelection,
        );

        expect(authorization.selectedAccount).toBe(previousSelection);
        expect(authorization.accounts).toEqual([
            createExpectedAccount({
                address: FIRST_ADDRESS,
                addressBase64: FIRST_ADDRESS_BASE64,
                label: '11111111..11111111',
            }),
            createExpectedAccount({
                address: SECOND_ADDRESS,
                addressBase64: SECOND_ADDRESS_BASE64,
                label: 'Stake account',
            }),
        ]);
    });

    it('normalizes the sign-in result into Uint8Array payloads', () => {
        expect.assertions(1);
        const account = getAccountFromAuthorizedAccount(
            createAuthorizedAccount({
                address: FIRST_ADDRESS_BASE64,
                label: 'Primary',
            }),
        );
        const signInResult = createSignInResult();

        expect(convertSignInResult({ account, signInResult })).toEqual(
            createExpectedSignInOutput({
                account: createExpectedAccount({
                    address: FIRST_ADDRESS,
                    addressBase64: FIRST_ADDRESS_BASE64,
                    label: 'Primary',
                }),
                signInResult,
            }),
        );
    });

    it('keeps the deprecated publicKey alias aligned with address', () => {
        expect.assertions(1);
        const account = getAccountFromAuthorizedAccount(
            createAuthorizedAccount({
                address: FIRST_ADDRESS_BASE64,
            }),
        );

        expect(account.publicKey.equals(account.address)).toBe(true);
    });
});

function setupTestEnvironment() {
    globalThis.Buffer = Buffer;
}
