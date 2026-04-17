import {
    AppIdentity,
    AuthorizeAPI,
    Chain,
    DeauthorizeAPI,
    SignInPayload,
    SolanaMobileWalletAdapterProtocolError,
    SolanaMobileWalletAdapterProtocolErrorCode,
} from '@solana-mobile/mobile-wallet-adapter-protocol';
import { Buffer } from 'buffer';

import {
    createAuthorizedAccount,
    createAuthorizationResult,
    createExpectedAccount,
    createExpectedAuthorization,
    createExpectedSignInOutput,
    createSignInResult,
    FIRST_ADDRESS,
    SECOND_ADDRESS,
    SECOND_ADDRESS_BASE64,
} from '../test-utils/fixtures';
import type { WalletAuthorization } from '../use-authorization';
import { useAuthorization } from '../use-authorization';

const mockUseAuthorizationStore = jest.fn();

jest.mock('react', () => {
    const actual = jest.requireActual('react');

    return {
        ...actual,
        useCallback: (callback: unknown) => callback,
        useMemo: (factory: () => unknown) => factory(),
    };
});

jest.mock('../use-authorization-store', () => ({
    useAuthorizationStore: (...args: unknown[]) => mockUseAuthorizationStore(...args),
}));

const CHAIN = 'solana:devnet' as Chain;
const IDENTITY = {
    name: 'Wallet UI',
    uri: 'https://wallet-ui.dev',
} as AppIdentity;

describe('useAuthorization', () => {
    beforeEach(() => {
        setupTestEnvironment();
    });

    it('authorizes with the existing auth token and persists the selected authorization', async () => {
        expect.assertions(3);
        const { authorization, persist } = useAuthorizationTestHarness();
        const wallet = createWallet({
            authorize: jest.fn().mockResolvedValue(
                createAuthorizationResult({
                    accounts: [
                        createAuthorizedAccount({
                            address: SECOND_ADDRESS_BASE64,
                            label: 'Stake account',
                        }),
                    ],
                    authToken: 'next-auth-token',
                }),
            ),
        });

        const selectedAccount = await authorization.authorizeSession(wallet as AuthorizeAPI);

        expect(wallet.authorize).toHaveBeenCalledWith({
            auth_token: 'cached-auth-token',
            chain: CHAIN,
            identity: IDENTITY,
        });
        expect(lastPersistedAuthorization(persist)).toEqual(
            createExpectedAuthorization({
                accounts: [
                    createExpectedAccount({
                        address: SECOND_ADDRESS,
                        addressBase64: SECOND_ADDRESS_BASE64,
                        label: 'Stake account',
                    }),
                ],
                authToken: 'next-auth-token',
            }),
        );
        expect(selectedAccount).toEqual(
            createExpectedAccount({
                address: SECOND_ADDRESS,
                addressBase64: SECOND_ADDRESS_BASE64,
                label: 'Stake account',
            }),
        );
    });

    it('retries without the cached auth token when authorization fails', async () => {
        expect.assertions(2);
        const { authorization, persist } = useAuthorizationTestHarness();
        const wallet = createWallet({
            authorize: jest
                .fn()
                .mockRejectedValueOnce(
                    new SolanaMobileWalletAdapterProtocolError(
                        1,
                        SolanaMobileWalletAdapterProtocolErrorCode.ERROR_AUTHORIZATION_FAILED,
                        'Authorization failed',
                    ),
                )
                .mockResolvedValueOnce(
                    createAuthorizationResult({
                        accounts: [
                            createAuthorizedAccount({
                                address: SECOND_ADDRESS_BASE64,
                            }),
                        ],
                        authToken: 'retried-auth-token',
                    }),
                ),
        });

        await authorization.authorizeSession(wallet as AuthorizeAPI);

        expect(wallet.authorize.mock.calls).toEqual([
            [
                {
                    auth_token: 'cached-auth-token',
                    chain: CHAIN,
                    identity: IDENTITY,
                },
            ],
            [
                {
                    chain: CHAIN,
                    identity: IDENTITY,
                },
            ],
        ]);
        expect(lastPersistedAuthorization(persist)).toEqual(
            createExpectedAuthorization({
                accounts: [
                    createExpectedAccount({
                        address: SECOND_ADDRESS,
                        addressBase64: SECOND_ADDRESS_BASE64,
                        label: 'Stake111..11111111',
                    }),
                ],
                authToken: 'retried-auth-token',
            }),
        );
    });

    it('returns a normalized sign-in result and persists the next authorization', async () => {
        expect.assertions(3);
        const { authorization, persist } = useAuthorizationTestHarness();
        const signInPayload = {
            address: FIRST_ADDRESS,
            domain: 'wallet-ui.dev',
        } as SignInPayload;
        const signInResult = createSignInResult();
        const wallet = createWallet({
            authorize: jest.fn().mockResolvedValue(
                createAuthorizationResult({
                    authToken: 'signed-in-auth-token',
                    signInResult,
                }),
            ),
        });

        const output = await authorization.authorizeSessionWithSignIn(wallet as AuthorizeAPI, signInPayload);

        expect(wallet.authorize).toHaveBeenCalledWith({
            auth_token: 'cached-auth-token',
            chain: CHAIN,
            identity: IDENTITY,
            sign_in_payload: signInPayload,
        });
        expect(lastPersistedAuthorization(persist)).toEqual(
            createExpectedAuthorization({
                authToken: 'signed-in-auth-token',
            }),
        );
        expect(output).toEqual(
            createExpectedSignInOutput({
                account: createExpectedAccount(),
                signInResult,
            }),
        );
    });

    it('deauthorizes the current session and clears persisted state', async () => {
        expect.assertions(2);
        const { authorization, persist } = useAuthorizationTestHarness();
        const wallet = createWallet({
            deauthorize: jest.fn().mockResolvedValue(undefined),
        });

        await authorization.deauthorizeSession(wallet as DeauthorizeAPI);

        expect(wallet.deauthorize).toHaveBeenCalledWith({
            auth_token: 'cached-auth-token',
        });
        expect(persist).toHaveBeenCalledWith(null);
    });

    it('clears persisted state without a wallet round-trip when deauthorizing all sessions', async () => {
        expect.assertions(1);
        const { authorization, persist } = useAuthorizationTestHarness();

        await authorization.deauthorizeSessions();

        expect(persist).toHaveBeenCalledWith(null);
    });
});

function createWallet({
    authorize = jest.fn(),
    deauthorize = jest.fn(),
}: {
    authorize?: jest.Mock;
    deauthorize?: jest.Mock;
} = {}) {
    return {
        authorize,
        deauthorize,
    };
}

function lastPersistedAuthorization(persist: jest.Mock): WalletAuthorization {
    return persist.mock.calls.at(-1)?.[0] as WalletAuthorization;
}

function useAuthorizationTestHarness() {
    const persist = jest.fn().mockResolvedValue(undefined);

    mockUseAuthorizationStore.mockReturnValue({
        accounts: [createExpectedAccount()],
        authToken: 'cached-auth-token',
        persist,
        selectedAccount: createExpectedAccount(),
    });

    return {
        authorization: useAuthorization({ chain: CHAIN, identity: IDENTITY, store: {} as never }),
        persist,
    };
}

function setupTestEnvironment() {
    globalThis.Buffer = Buffer;
}
