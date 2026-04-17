import AsyncStorage from '@react-native-async-storage/async-storage';

import { resetAsyncStorageMock } from '../../../test-config/react-native-unit-test-utils';
import { createExpectedAccount, FIRST_ADDRESS, FIRST_ADDRESS_BASE64 } from '../test-utils/fixtures';
import { useMobileWallet } from '../use-mobile-wallet';

let currentContext: unknown;

const mockAppendTransactionMessageInstructions = jest.fn();
const mockAuthorizeSession = jest.fn();
const mockAuthorizeSessionWithSignIn = jest.fn();
const mockCreateTransactionMessage = jest.fn();
const mockDecodeBase58 = jest.fn();
const mockDeauthorizeSession = jest.fn();
const mockDeauthorizeSessions = jest.fn();
const mockPipe = jest.fn();
const mockSetTransactionMessageFeePayerSigner = jest.fn();
const mockSetTransactionMessageLifetimeUsingBlockhash = jest.fn();
const mockSignAndSendTransactionMessageWithSigners = jest.fn();
const mockTransact = jest.fn();
const mockUseAuthorization = jest.fn();

jest.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        getItem: jest.fn(),
        removeItem: jest.fn(),
        setItem: jest.fn(),
    },
}));

jest.mock('react', () => {
    const actual = jest.requireActual('react');

    return {
        ...actual,
        useCallback: (callback: unknown) => callback,
        useContext: () => currentContext,
        useMemo: (factory: () => unknown) => factory(),
    };
});

jest.mock('@solana-mobile/mobile-wallet-adapter-protocol-kit', () => ({
    transact: (...args: unknown[]) => mockTransact(...args),
}));

jest.mock('@solana/kit', () => ({
    appendTransactionMessageInstructions: (...args: unknown[]) => mockAppendTransactionMessageInstructions(...args),
    createTransactionMessage: (...args: unknown[]) => mockCreateTransactionMessage(...args),
    getBase58Decoder: () => ({
        decode: (...args: unknown[]) => mockDecodeBase58(...args),
    }),
    pipe: (...args: unknown[]) => mockPipe(...args),
    setTransactionMessageFeePayerSigner: (...args: unknown[]) => mockSetTransactionMessageFeePayerSigner(...args),
    setTransactionMessageLifetimeUsingBlockhash: (...args: unknown[]) =>
        mockSetTransactionMessageLifetimeUsingBlockhash(...args),
    signAndSendTransactionMessageWithSigners: (...args: unknown[]) =>
        mockSignAndSendTransactionMessageWithSigners(...args),
}));

jest.mock('../use-authorization', () => ({
    useAuthorization: (...args: unknown[]) => mockUseAuthorization(...args),
}));

describe('useMobileWallet', () => {
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
        const callback = jest.fn().mockResolvedValue('connected-via-callback');
        const transportWallet = createTransportWallet();
        const { mobileWallet } = useMobileWalletTestHarness({ transportWallet });

        const result = await mobileWallet.connectAnd(callback);

        expect(callback).toHaveBeenCalledWith(transportWallet);
        expect(mockAuthorizeSession).not.toHaveBeenCalled();
        expect(result).toBe('connected-via-callback');
    });

    it('signs messages with the authorized address', async () => {
        expect.assertions(3);
        const signedMessage = Uint8Array.from([9, 9, 9]);
        const transportWallet = createTransportWallet({
            signMessages: jest.fn().mockResolvedValue([signedMessage]),
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
            signAndSendTransactions: jest.fn().mockResolvedValue(['signature']),
            signTransactions: jest.fn().mockResolvedValue([signedTransaction]),
        });
        const { mobileWallet } = useMobileWalletTestHarness({ transportWallet });

        const signedResult = await mobileWallet.signTransactions(transaction as never);
        const submittedResult = await mobileWallet.signAndSendTransactions(transaction as never, 99n);

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
            signAndSendTransactions: jest.fn().mockResolvedValue(['signature']),
            signMessages: jest.fn().mockResolvedValue([signedMessage]),
            signTransactions: jest.fn().mockResolvedValue([signedTransaction]),
        });
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const { mobileWallet } = useMobileWalletTestHarness({ transportWallet });

        expect(await mobileWallet.signMessage(Uint8Array.from([1, 1, 1]))).toEqual(signedMessage);
        expect(await mobileWallet.signAndSendTransaction({ id: 'tx' } as never, 10n)).toBe('signature');
        expect(await mobileWallet.signTransaction({ id: 'tx' } as never)).toEqual(signedTransaction);
        expect(warnSpy).toHaveBeenCalledTimes(3);
    });

    it('routes the deprecated sendTransaction alias to sendTransactions', async () => {
        expect.assertions(2);
        const { mobileWallet } = useMobileWalletTestHarness();
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        expect(await mobileWallet.sendTransaction([{ id: 'ix' } as never])).toBe('decoded-signature');
        expect(warnSpy).toHaveBeenCalledWith(
            '[wallet-ui] `sendTransaction` is deprecated. Use `sendTransactions` instead.',
        );
    });

    it('builds and sends transactions through the kit pipeline helpers', async () => {
        expect.assertions(7);
        const blockhash = {
            blockhash: 'latest-blockhash',
            lastValidBlockHeight: 123,
        };
        const instructions = [{ id: 'instruction' }] as never[];
        const { mobileWallet } = useMobileWalletTestHarness({
            contextOverrides: {
                client: {
                    rpc: {
                        getLatestBlockhash: jest.fn(() => ({
                            send: jest.fn().mockResolvedValue({
                                context: {
                                    slot: 42n,
                                },
                                value: blockhash,
                            }),
                        })),
                    },
                    rpcSubscriptions: {},
                },
            },
        });

        const result = await mobileWallet.sendTransactions(instructions);

        expect(mockCreateTransactionMessage).toHaveBeenCalledWith({
            version: 0,
        });
        expect(mockAppendTransactionMessageInstructions).toHaveBeenCalledWith(instructions, {
            version: 0,
        });
        expect(mockSetTransactionMessageFeePayerSigner).toHaveBeenCalledWith(
            {
                address: FIRST_ADDRESS,
                signAndSendTransactions: expect.any(Function),
            },
            {
                instructions,
                transactionMessage: {
                    version: 0,
                },
            },
        );
        expect(mockSetTransactionMessageLifetimeUsingBlockhash).toHaveBeenCalledWith(blockhash, {
            signer: {
                address: FIRST_ADDRESS,
                signAndSendTransactions: expect.any(Function),
            },
            transactionMessage: {
                instructions,
                transactionMessage: {
                    version: 0,
                },
            },
        });
        expect(mockSignAndSendTransactionMessageWithSigners).toHaveBeenCalledWith({
            blockhash,
            transactionMessage: {
                signer: {
                    address: FIRST_ADDRESS,
                    signAndSendTransactions: expect.any(Function),
                },
                transactionMessage: {
                    instructions,
                    transactionMessage: {
                        version: 0,
                    },
                },
            },
        });
        expect(mockDecodeBase58).toHaveBeenCalledWith(Uint8Array.from([7, 8, 9]));
        expect(result).toBe('decoded-signature');
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
        client: {
            rpc: {
                getLatestBlockhash: jest.fn(() => ({
                    send: jest.fn().mockResolvedValue({
                        context: {
                            slot: 42n,
                        },
                        value: {
                            blockhash: 'latest-blockhash',
                            lastValidBlockHeight: 123,
                        },
                    }),
                })),
            },
            rpcSubscriptions: {},
        },
        identity: {
            name: 'Wallet UI',
            uri: 'https://wallet-ui.dev',
        },
        store: {},
        ...overrides,
    };
}

function createTransportWallet({
    authorize = jest.fn(),
    signAndSendTransactions = jest.fn(),
    signMessages = jest.fn(),
    signTransactions = jest.fn(),
}: {
    authorize?: jest.Mock;
    signAndSendTransactions?: jest.Mock;
    signMessages?: jest.Mock;
    signTransactions?: jest.Mock;
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
    currentContext = createContextValue(contextOverrides);
    resetAsyncStorageMock(AsyncStorage as unknown as Parameters<typeof resetAsyncStorageMock>[0]);
    mockAppendTransactionMessageInstructions.mockImplementation((instructions, transactionMessage) => ({
        instructions,
        transactionMessage,
    }));
    mockAuthorizeSession.mockResolvedValue(createExpectedAccount({ label: 'Primary' }));
    mockAuthorizeSessionWithSignIn.mockResolvedValue({
        account: createExpectedAccount({ label: 'Primary' }),
        signature: Uint8Array.from([1, 2, 3]),
        signedMessage: Uint8Array.from([4, 5, 6]),
    });
    mockCreateTransactionMessage.mockReturnValue({
        version: 0,
    });
    mockDecodeBase58.mockReturnValue('decoded-signature');
    mockDeauthorizeSession.mockResolvedValue(undefined);
    mockDeauthorizeSessions.mockResolvedValue(undefined);
    mockPipe.mockImplementation((value, ...steps) => steps.reduce((current, step) => step(current), value));
    mockSetTransactionMessageFeePayerSigner.mockImplementation((signer, transactionMessage) => ({
        signer,
        transactionMessage,
    }));
    mockSetTransactionMessageLifetimeUsingBlockhash.mockImplementation((blockhash, transactionMessage) => ({
        blockhash,
        transactionMessage,
    }));
    mockSignAndSendTransactionMessageWithSigners.mockResolvedValue(Uint8Array.from([7, 8, 9]));
    mockTransact.mockImplementation(async callback => await callback(transportWallet));
    mockUseAuthorization.mockReturnValue(createAuthorizationHookValue());

    return {
        mobileWallet: useMobileWallet(),
        transportWallet,
    };
}
