import {
    SolanaSignIn,
    type SolanaSignInFeature,
    type SolanaSignInInput,
    type SolanaSignInOutput,
    SolanaSignMessage,
    type SolanaSignMessageFeature,
} from '@solana/wallet-standard-features';
import { createSignInMessage } from '@solana/wallet-standard-util';
import {
    getWalletAccountFeature,
    getWalletFeature,
    type UiWallet,
    type UiWalletAccount,
    uiWalletAccountBelongsToUiWallet,
} from '@wallet-standard/ui';

import {
    getOrCreateUiWalletAccountForStandardWalletAccount,
    getWalletAccountForUiWalletAccount,
    getWalletForHandle,
} from './wallet-standard-ui-registry';
import { WalletUiAuthError, type WalletUiAuthResult, type WalletUiAuthSignMessage } from './wallet-ui-auth-types';

type SolanaSignInInputWithRequiredFields = Required<Pick<SolanaSignInInput, 'address' | 'domain'>> & SolanaSignInInput;

export function getTargetAccount(account: UiWalletAccount | undefined, wallet: UiWallet): UiWalletAccount | undefined {
    if (account && uiWalletAccountBelongsToUiWallet(account, wallet)) {
        return account;
    }
    return undefined;
}

export function hasFeature(handle: Pick<UiWallet | UiWalletAccount, 'features'> | undefined, featureName: string) {
    return Boolean(handle && (handle.features as readonly string[]).includes(featureName));
}

export async function signInWithMessageFeature({
    account,
    input,
}: {
    account: UiWalletAccount;
    input: SolanaSignInInput;
}): Promise<WalletUiAuthResult> {
    const messageSignInInput = getMessageSignInInput(account, input);
    const { signMessage } = getWalletAccountFeature(
        account,
        SolanaSignMessage,
    ) as SolanaSignMessageFeature[typeof SolanaSignMessage];
    const walletAccount = getWalletAccountForUiWalletAccount(account);
    const [output] = await signMessage({ account: walletAccount, message: createSignInMessage(messageSignInInput) });

    if (!output) {
        throw new WalletUiAuthError('message-signing-unavailable');
    }

    return getMessageSignInResult({ account, input: messageSignInInput, output });
}

export async function signInWithMessageSigner({
    account,
    input,
    signMessage,
}: {
    account: UiWalletAccount;
    input: SolanaSignInInput;
    signMessage: WalletUiAuthSignMessage;
}): Promise<WalletUiAuthResult> {
    const messageSignInInput = getMessageSignInInput(account, input);
    const output = await signMessage({ message: createSignInMessage(messageSignInInput) });
    return getMessageSignInResult({ account, input: messageSignInInput, output });
}

function getMessageSignInResult({
    account,
    input,
    output,
}: {
    account: UiWalletAccount;
    input: SolanaSignInInputWithRequiredFields;
    output: Awaited<ReturnType<WalletUiAuthSignMessage>>;
}): WalletUiAuthResult {
    return {
        account,
        input,
        method: SolanaSignMessage,
        signature: output.signature,
        signedMessage: output.signedMessage,
    };
}

export async function signInWithNativeFeature({
    account,
    connect,
    input,
    wallet,
}: {
    account: UiWalletAccount | undefined;
    connect: (account: UiWalletAccount) => void;
    input: SolanaSignInInput;
    wallet: UiWallet;
}): Promise<WalletUiAuthResult> {
    const signInInput = account?.address && !input.address ? { ...input, address: account.address } : { ...input };
    const { signIn } = getWalletFeature(wallet, SolanaSignIn) as SolanaSignInFeature[typeof SolanaSignIn];
    const [output] = await signIn(signInInput);

    if (!output) {
        throw new WalletUiAuthError('auth-unsupported');
    }

    const uiAccount = getUiWalletAccountForSignedInAccount({ account, output, wallet });
    if (wallet.accounts.includes(uiAccount)) {
        connect(uiAccount);
    }

    return {
        account: uiAccount,
        input: signInInput,
        method: SolanaSignIn,
        signature: output.signature,
        signedMessage: output.signedMessage,
    };
}

function getUiWalletAccountForSignedInAccount({
    account,
    output,
    wallet,
}: {
    account: UiWalletAccount | undefined;
    output: SolanaSignInOutput;
    wallet: UiWallet;
}): UiWalletAccount {
    const matchingCurrentAccount = account?.address === output.account.address ? account : undefined;

    return (
        wallet.accounts.find(walletAccount => walletAccount.address === output.account.address) ??
        matchingCurrentAccount ??
        getOrCreateUiWalletAccountForStandardWalletAccount(getWalletForHandle(wallet), output.account)
    );
}

function getLocationHost(): string | undefined {
    if (typeof location === 'undefined') {
        return undefined;
    }
    return location.host || undefined;
}

function getMessageSignInInput(
    account: UiWalletAccount,
    input: SolanaSignInInput,
): SolanaSignInInputWithRequiredFields {
    const domain = input.domain ?? getLocationHost();
    if (!domain) {
        throw new WalletUiAuthError('missing-domain');
    }

    return {
        ...input,
        address: account.address,
        domain,
    };
}
