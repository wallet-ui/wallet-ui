import {
    SolanaSignIn,
    type SolanaSignInInput,
    type SolanaSignInOutput,
    SolanaSignMessage,
    type SolanaSignMessageInput,
    type SolanaSignMessageOutput,
} from '@solana/wallet-standard-features';
import type { UiWallet, UiWalletAccount } from '@wallet-standard/ui';
import type { ReactNode } from 'react';

export type { UiWallet, UiWalletAccount };

export type WalletUiAuthMethod = typeof SolanaSignIn | typeof SolanaSignMessage;

export type WalletUiAuthNativeSignIn = (
    input?: SolanaSignInInput,
) => Promise<Omit<SolanaSignInOutput, 'account' | 'signatureType'> & { account: UiWalletAccount }>;

export interface UseWalletUiAuthOptions {
    wallet: UiWallet;
}

export type WalletUiAuthSignMessage = (
    input: Omit<SolanaSignMessageInput, 'account'>,
) => Promise<Omit<SolanaSignMessageOutput, 'signatureType'>>;

export type WalletUiAuthUnavailableReason =
    | 'auth-unsupported'
    | 'message-signing-unavailable'
    | 'missing-domain'
    | 'wallet-not-connected';

export interface WalletUiAuthProps {
    children(auth: WalletUiAuthState): ReactNode;
    wallet: UiWallet;
}

export interface WalletUiAuthResult {
    account: UiWalletAccount;
    input: SolanaSignInInput;
    method: WalletUiAuthMethod;
    signature: Uint8Array;
    signedMessage: Uint8Array;
}

export interface WalletUiAuthSignInOptions {
    input?: SolanaSignInInput;
}

export interface WalletUiAuthState {
    canSignIn: boolean;
    isSigningIn: boolean;
    messageSigningAvailable: boolean;
    nativeSignInAvailable: boolean;
    reason: WalletUiAuthUnavailableReason | undefined;
    signIn(options?: WalletUiAuthSignInOptions): Promise<WalletUiAuthResult>;
}

const AUTH_ERROR_MESSAGES: Record<WalletUiAuthUnavailableReason, string> = {
    'auth-unsupported': 'The selected wallet does not support Sign In With Solana or message signing.',
    'message-signing-unavailable': 'The selected wallet account does not support message signing.',
    'missing-domain': 'A Sign In With Solana fallback message requires a domain.',
    'wallet-not-connected': 'Connect a wallet account before signing in.',
};

export class WalletUiAuthError extends Error {
    readonly cause?: unknown;
    readonly reason: WalletUiAuthUnavailableReason;

    constructor(reason: WalletUiAuthUnavailableReason, cause?: unknown) {
        super(AUTH_ERROR_MESSAGES[reason]);
        this.cause = cause;
        this.name = 'WalletUiAuthError';
        this.reason = reason;
    }
}
