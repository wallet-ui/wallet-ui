import {
    SolanaSignAndSendTransaction,
    type SolanaSignAndSendTransactionFeature,
    SolanaSignTransaction,
    type SolanaSignTransactionFeature,
    type SolanaTransactionVersion,
} from '@solana/wallet-standard-features';
import type { UiWalletAccount } from '@wallet-standard/react';
import { getWalletAccountFeature } from '@wallet-standard/ui';
import { useMemo } from 'react';

const NO_TRANSACTION_VERSIONS: readonly SolanaTransactionVersion[] = Object.freeze([]);

/**
 * The transaction versions the wallet behind `account` can sign, as advertised on its
 * `solana:signAndSendTransaction` feature (the feature `useWalletUiSigner` uses), or on its `solana:signTransaction`
 * feature when the wallet only signs. Returns an empty list when the account offers neither feature.
 *
 * Build a version 1 transaction only when this list includes `1`.
 */
export function getWalletUiAccountTransactionVersions(account: UiWalletAccount): readonly SolanaTransactionVersion[] {
    if (account.features.includes(SolanaSignAndSendTransaction)) {
        const feature = getWalletAccountFeature(
            account,
            SolanaSignAndSendTransaction,
        ) as SolanaSignAndSendTransactionFeature[typeof SolanaSignAndSendTransaction];
        return feature.supportedTransactionVersions;
    }
    if (account.features.includes(SolanaSignTransaction)) {
        const feature = getWalletAccountFeature(
            account,
            SolanaSignTransaction,
        ) as SolanaSignTransactionFeature[typeof SolanaSignTransaction];
        return feature.supportedTransactionVersions;
    }
    return NO_TRANSACTION_VERSIONS;
}

/**
 * React hook variant of {@link getWalletUiAccountTransactionVersions}. The result is memoized per account handle, and
 * wallet-standard hands out a new handle whenever a wallet's features change, so it stays current when a wallet
 * updates its advertised versions after connecting.
 */
export function useWalletUiTransactionVersions({
    account,
}: {
    account: UiWalletAccount;
}): readonly SolanaTransactionVersion[] {
    return useMemo(() => getWalletUiAccountTransactionVersions(account), [account]);
}
