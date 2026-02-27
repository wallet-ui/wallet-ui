import { SolanaSignInOutput } from '@solana/wallet-standard-features';
import { SignInResult } from '@solana-mobile/mobile-wallet-adapter-protocol';
import { stringToUint8Array } from '@wallet-ui/core';

import { Account } from './use-authorization';

export type SignInOutput = Omit<SolanaSignInOutput, 'account' | 'signatureType'> &
    Readonly<{
        account: Account;
    }>;

export function convertSignInResult({
    account,
    signInResult,
}: {
    account: Account;
    signInResult: SignInResult;
}): SignInOutput {
    return {
        account,
        signature: stringToUint8Array(signInResult.signature),
        signedMessage: stringToUint8Array(signInResult.signed_message),
    };
}
