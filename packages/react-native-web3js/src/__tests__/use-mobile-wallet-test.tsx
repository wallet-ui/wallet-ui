import type { Mock } from 'vitest';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';

import { resetAsyncStorageMock } from '../../../test-config/react-native-unit-test-utils';
import { createExpectedAccount, FIRST_ADDRESS_BASE64 } from '../test-utils/fixtures';
import { useMobileWallet } from '../use-mobile-wallet';

const mockAuthorizeSession = vi.fn();
const mockAuthorizeSessionWithSignIn = vi.fn();
const mockDeauthorizeSession = vi.fn();
const mockDeauthorizeSessions = vi.fn();
const mockTransact = vi.fn();
const mockUseContext = vi.fn();
const mockUseAuthorization = vi.fn();

vi.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        getItem: vi.fn(),
        removeItem: vi.fn(),
        setItem: vi.fn(),
    },
}));

vi.mock('react', () => {
    const react = {
        createContext: () => ({}),
        useCallback: (callback: unknown) => callback,
        useContext: (...args: unknown[]) => mockUseContext(...args),
        useEffect: () => undefined,
        useMemo: (factory: () => unknown) => factory(),
        useState: (factory: () => unknown) => [factory(), vi.fn()],
    };

    return {
        ...react,
        default: react,
    };
});

vi.mock('@solana-mobile/mobile-wallet-adapter-protocol-web3js', () => ({
    transact: (...args: unknown[]) => mockTransact(...args),
}));

vi.mock('../use-authorization', () => ({
    useAuthorization: (...args: unknown[]) => mockUseAuthorization(...args),
}));

describe('useMobileWallet', () => {
    beforeEach(() => {
        setupTestEnvironment();
    });

    it('connects through the transport and returns the selected account', async () => {
        expect.assertions(3);
        const { mobileWallet } = useMobileWalletTestHarness();
        const account = await mobileWallet.connect();

        expect(mockTransact).toHaveBeenCalledTimes(1);
        expect(mockAuthorizeSession).toHaveBeenCalledWith(expect.objectContaining({ authorize: expect.any(Function) }));
        expect(account).toEqual(createExpectedAccount({ label: 'Primary' }));
    });

    it('passes the transport wallet into connectAnd callbacks', async () => {
        expect.assertions(3);
        const callback = vi.fn().mockResolvedValue('connected-via-callback');
        const transportWallet = createTransportWallet();
        const { mobileWallet } = useMobileWalletTestHarness({ transportWallet });

        const result = await mobileWallet.connectAnd(callback);

        expect(callback).toHaveBeenCalledWith(transportWallet);
        expect(mockAuthorizeSession).not.toHaveBeenCalled();
        expect(result).toBe('connected-via-callback');
    });

    it('rejects invalid identity URI schemes before launching the wallet transport', async () => {
        expect.assertions(2);
        const { mobileWallet } = useMobileWalletTestHarness({
            contextOverrides: {
                identity: {
                    name: 'My App',
                    uri: 'my_app://my-app',
                },
            },
        });

        await expect(mobileWallet.connect()).rejects.toThrow('Invalid Mobile Wallet Adapter identity.uri');

        expect(mockTransact).not.toHaveBeenCalled();
    });

    it('signs in through the transport wallet', async () => {
        expect.assertions(3);
        const signInPayload = {
            domain: 'wallet-ui.dev',
            statement: 'Sign in to Wallet UI',
        };
        const transportWallet = createTransportWallet();
        const { mobileWallet } = useMobileWalletTestHarness({ transportWallet });

        const result = await mobileWallet.signIn(signInPayload);

        expect(mockTransact).toHaveBeenCalledTimes(1);
        expect(mockAuthorizeSessionWithSignIn).toHaveBeenCalledWith(transportWallet, signInPayload);
        expect(result).toEqual({
            account: createExpectedAccount({ label: 'Primary' }),
            signature: Uint8Array.from([1, 2, 3]),
            signedMessage: Uint8Array.from([4, 5, 6]),
        });
    });

    it('signs messages with the authorized address', async () => {
        expect.assertions(3);
        const signedMessage = Uint8Array.from([9, 9, 9]);
        const transportWallet = createTransportWallet({
            signMessages: vi.fn().mockResolvedValue([signedMessage]),
        });
        const { mobileWallet } = useMobileWalletTestHarness({ transportWallet });

        const result = await mobileWallet.signMessages(Uint8Array.from([1, 2, 3]));

        expect(mockAuthorizeSession).toHaveBeenCalledWith(transportWallet);
        expect(transportWallet.signMessages).toHaveBeenCalledWith({
            addresses: [FIRST_ADDRESS_BASE64],
            payloads: [Uint8Array.from([1, 2, 3])],
        });
        expect(result).toEqual(signedMessage);
    });

    it('delegates signTransactions and signAndSendTransactions through the transport wallet', async () => {
        expect.assertions(5);
        const signedTransaction = {
            id: 'signed-transaction',
        };
        const transaction = {
            id: 'transaction',
        };
        const transportWallet = createTransportWallet({
            signAndSendTransactions: vi.fn().mockResolvedValue(['signature']),
            signTransactions: vi.fn().mockResolvedValue([signedTransaction]),
        });
        const { mobileWallet } = useMobileWalletTestHarness({ transportWallet });

        const signedResult = await mobileWallet.signTransactions(transaction as never);
        const submittedResult = await mobileWallet.signAndSendTransactions(transaction as never, 99);

        expect(mockAuthorizeSession).toHaveBeenCalledWith(transportWallet);
        expect(transportWallet.signTransactions).toHaveBeenCalledWith({
            transactions: [transaction],
        });
        expect(transportWallet.signAndSendTransactions).toHaveBeenCalledWith({
            minContextSlot: 99,
            transactions: [transaction],
        });
        expect(signedResult).toEqual(signedTransaction);
        expect(submittedResult).toBe('signature');
    });

    it('routes deprecated aliases to the current methods', async () => {
        expect.assertions(4);
        const signedMessage = Uint8Array.from([6, 6, 6]);
        const signedTransaction = {
            id: 'signed-transaction',
        };
        const transportWallet = createTransportWallet({
            signAndSendTransactions: vi.fn().mockResolvedValue(['signature']),
            signMessages: vi.fn().mockResolvedValue([signedMessage]),
            signTransactions: vi.fn().mockResolvedValue([signedTransaction]),
        });
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const { mobileWallet } = useMobileWalletTestHarness({ transportWallet });

        expect(await mobileWallet.signMessage(Uint8Array.from([1, 1, 1]))).toEqual(signedMessage);
        expect(await mobileWallet.signAndSendTransaction({ id: 'tx' } as never, 10)).toBe('signature');
        expect(await mobileWallet.signTransaction({ id: 'tx' } as never)).toEqual(signedTransaction);
        expect(warnSpy).toHaveBeenCalledTimes(3);
    });
});

function createAuthorizationHookValue() {
    return {
        accounts: [createExpectedAccount({ label: 'Primary' })],
        authorizeSession: mockAuthorizeSession,
        authorizeSessionWithSignIn: mockAuthorizeSessionWithSignIn,
        deauthorizeSession: mockDeauthorizeSession,
        deauthorizeSessions: mockDeauthorizeSessions,
        selectedAccount: createExpectedAccount({ label: 'Primary' }),
    };
}

function createContextValue(overrides: Record<string, unknown> = {}) {
    return {
        cache: undefined,
        chain: 'solana:devnet',
        connection: {},
        identity: {
            name: 'Wallet UI',
            uri: 'https://wallet-ui.dev',
        },
        store: {},
        ...overrides,
    };
}

function createTransportWallet({
    authorize = vi.fn(),
    signAndSendTransactions = vi.fn(),
    signMessages = vi.fn(),
    signTransactions = vi.fn(),
}: {
    authorize?: Mock;
    signAndSendTransactions?: Mock;
    signMessages?: Mock;
    signTransactions?: Mock;
} = {}) {
    return {
        authorize,
        signAndSendTransactions,
        signMessages,
        signTransactions,
    };
}

function useMobileWalletTestHarness({
    contextOverrides,
    transportWallet = createTransportWallet(),
}: {
    contextOverrides?: Record<string, unknown>;
    transportWallet?: ReturnType<typeof createTransportWallet>;
} = {}) {
    mockUseContext.mockReturnValue(createContextValue(contextOverrides));
    resetAsyncStorageMock(AsyncStorage as unknown as Parameters<typeof resetAsyncStorageMock>[0]);
    mockAuthorizeSession.mockResolvedValue(createExpectedAccount({ label: 'Primary' }));
    mockAuthorizeSessionWithSignIn.mockResolvedValue({
        account: createExpectedAccount({ label: 'Primary' }),
        signature: Uint8Array.from([1, 2, 3]),
        signedMessage: Uint8Array.from([4, 5, 6]),
    });
    mockDeauthorizeSession.mockResolvedValue(undefined);
    mockDeauthorizeSessions.mockResolvedValue(undefined);
    mockTransact.mockImplementation(async callback => await callback(transportWallet));
    mockUseAuthorization.mockReturnValue(createAuthorizationHookValue());

    return {
        mobileWallet: useMobileWallet(),
        transportWallet,
    };
}

function setupTestEnvironment() {
    globalThis.Buffer = Buffer;
}
