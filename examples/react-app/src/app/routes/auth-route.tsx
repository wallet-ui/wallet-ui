import { UiGroup, UiPanel, UiStack } from '@wallet-ui/playground-react';
import {
    type SolanaSignInInput,
    type UiWallet,
    useWalletUi,
    WalletUiAuth,
    WalletUiAuthError,
    type WalletUiAuthResult,
    type WalletUiAuthState,
    WalletUiDropdown,
} from '@wallet-ui/react';
import { useState } from 'react';

type AuthPayload = {
    account: {
        address: string;
        publicKey: number[];
    };
    input: SolanaSignInInput;
    method: WalletUiAuthResult['method'];
    signature: number[];
    signedMessage: number[];
};

export default function AuthRoute() {
    const { wallet } = useWalletUi();

    return (
        <UiStack>
            <UiPanel title="Sign In With Solana">
                <WalletUiDropdown />
                {wallet ? (
                    <WalletUiAuth key={wallet.name} wallet={wallet}>
                        {auth => <AuthControls auth={auth} wallet={wallet} />}
                    </WalletUiAuth>
                ) : (
                    <button disabled>Connect wallet</button>
                )}
            </UiPanel>
        </UiStack>
    );
}

function AuthControls({ auth, wallet }: { auth: WalletUiAuthState; wallet: UiWallet }) {
    const [error, setError] = useState<string | undefined>();
    const [payload, setPayload] = useState<AuthPayload | undefined>();

    return (
        <UiStack>
            <UiGroup>
                <button disabled={!auth.canSignIn || auth.isSigningIn} onClick={() => void handleSignIn()}>
                    {auth.isSigningIn ? 'Signing in...' : 'Sign in'}
                </button>
                <span>{getStatus(auth)}</span>
            </UiGroup>
            {error ? <pre>{error}</pre> : null}
            {payload ? <pre>{JSON.stringify(payload, null, 4)}</pre> : null}
        </UiStack>
    );

    async function handleSignIn() {
        setError(undefined);
        setPayload(undefined);
        try {
            const result = await auth.signIn({
                input: createDemoSignInInput(wallet),
            });
            setPayload(createAuthPayload(result));
        } catch (e) {
            setError(getErrorMessage(e));
        }
    }
}

function createAuthPayload(result: WalletUiAuthResult): AuthPayload {
    return {
        account: {
            address: result.account.address,
            publicKey: Array.from(result.account.publicKey),
        },
        input: result.input,
        method: result.method,
        signature: Array.from(result.signature),
        signedMessage: Array.from(result.signedMessage),
    };
}

function createDemoNonce() {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function createDemoSignInInput(wallet: UiWallet): SolanaSignInInput {
    return {
        domain: window.location.host,
        issuedAt: new Date().toISOString(),
        nonce: createDemoNonce(),
        statement: `Sign in to Wallet UI React App with ${wallet.name}.`,
        uri: window.location.origin,
        version: '1',
    };
}

function getErrorMessage(error: unknown) {
    if (error instanceof WalletUiAuthError) {
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}

function getStatus(auth: WalletUiAuthState) {
    if (auth.nativeSignInAvailable) {
        return 'Native SIWS';
    }
    if (auth.messageSigningAvailable) {
        return 'Message fallback';
    }
    return auth.reason ?? 'Ready';
}
