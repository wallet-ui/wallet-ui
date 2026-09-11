import {
    address,
    appendTransactionMessageInstruction,
    assertIsTransactionMessageWithSingleSendingSigner,
    createTransactionMessage,
    estimateAndSetResourceLimitsFactory,
    estimateResourceLimitsFactory,
    pipe,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    signAndSendTransactionMessageWithSigners,
} from '@solana/kit';
import {
    getUiWalletAccountStorageKey,
    type UiWalletAccount,
    useWallets,
    useWalletUiCluster,
    useWalletUiSigner,
    useWalletUiTransactionVersions,
} from '@wallet-ui/react';
import type { SyntheticEvent } from 'react';
import React, { useMemo, useState } from 'react';
import { solStringToLamports } from '../../lib/sol-string-to-lamports';
import { useError } from '../../lib/use-error';
import { getTransferSolInstruction } from '@solana-program/system';

import { PlaygroundErrorPanel } from '../playground-error-panel';
import { PlaygroundTxSuccess } from '../playground-tx-success';
import { useSolanaClient } from '../solana-client-provider';

export function PlaygroundSignAndSendTx({ account }: { account: UiWalletAccount }) {
    const { error, hasError, setError, resetError } = useError();
    const { cluster } = useWalletUiCluster();
    const client = useSolanaClient();
    const wallets = useWallets();
    const [isSendingTransaction, setIsSendingTransaction] = useState(false);
    const [lastSignature, setLastSignature] = useState<Uint8Array | undefined>();
    const [lastVersion, setLastVersion] = useState<0 | 1>(0);
    const [solQuantityString, setSolQuantityString] = useState<string>('');
    const [recipientAccountStorageKey, setRecipientAccountStorageKey] = useState<string | undefined>();

    const recipientAccount = useMemo(() => {
        if (recipientAccountStorageKey) {
            for (const wallet of wallets) {
                for (const account of wallet.accounts) {
                    if (getUiWalletAccountStorageKey(account) === recipientAccountStorageKey) {
                        return account;
                    }
                }
            }
        }
    }, [recipientAccountStorageKey, wallets]);
    const transactionSendingSigner = useWalletUiSigner({ account });
    // Build a version 1 transaction when the wallet advertises support for it, otherwise fall back to version 0.
    const supportedTransactionVersions = useWalletUiTransactionVersions({ account });
    const version = supportedTransactionVersions.includes(1) ? 1 : 0;

    async function submit() {
        resetError();
        setIsSendingTransaction(true);
        try {
            const amount = solStringToLamports(solQuantityString);
            console.log('amount', amount);
            if (!recipientAccount) {
                throw new Error('The address of the recipient could not be found');
            }
            const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send();
            const message = pipe(
                createTransactionMessage({ version }),
                m => setTransactionMessageFeePayerSigner(transactionSendingSigner, m),
                m => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
                m =>
                    appendTransactionMessageInstruction(
                        getTransferSolInstruction({
                            amount,
                            destination: address(recipientAccount.address),
                            source: transactionSendingSigner,
                        }),
                        m,
                    ),
            );
            assertIsTransactionMessageWithSingleSendingSigner(message);
            // A version 1 transaction is budgeted zero compute units unless it carries a compute unit limit, so
            // simulate to estimate the limits the runtime needs. Version 0 messages go out without limits, as before.
            const messageWithLimits =
                version === 1
                    ? await estimateAndSetResourceLimitsFactory(estimateResourceLimitsFactory({ rpc: client.rpc }))(
                          message,
                      )
                    : message;
            const signature = await signAndSendTransactionMessageWithSigners(messageWithLimits);

            setLastSignature(signature);
            setLastVersion(version);
            setSolQuantityString('');
        } catch (e) {
            setLastSignature(undefined);
            setError(e as any);
        } finally {
            setIsSendingTransaction(false);
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            <form
                onSubmit={async e => {
                    e.preventDefault();
                    await submit();
                }}
            >
                <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div style={{ flexGrow: 1, minWidth: 90, maxWidth: 90 }}>
                            <input
                                disabled={isSendingTransaction}
                                placeholder="Amount"
                                onChange={(e: SyntheticEvent<HTMLInputElement>) =>
                                    setSolQuantityString(e.currentTarget.value)
                                }
                                type="number"
                                style={{ width: '100%' }}
                                value={solQuantityString}
                            />
                        </div>
                        <div>
                            <select
                                disabled={isSendingTransaction}
                                value={recipientAccount ? getUiWalletAccountStorageKey(recipientAccount) : undefined}
                                onChange={(e: SyntheticEvent<HTMLSelectElement>) =>
                                    setRecipientAccountStorageKey(e.currentTarget.value)
                                }
                            >
                                <option value={undefined}>Select a Connected Account</option>
                                {wallets.flatMap(wallet =>
                                    wallet.accounts
                                        .filter(({ chains }) => chains.includes(cluster.id))
                                        .map(account => {
                                            const key = getUiWalletAccountStorageKey(account);
                                            return (
                                                <option key={key} value={key}>
                                                    {account.address}
                                                </option>
                                            );
                                        }),
                                )}
                            </select>
                        </div>

                        <button
                            disabled={solQuantityString === '' || !recipientAccount || isSendingTransaction}
                            type="submit"
                        >
                            {isSendingTransaction ? 'Sending...' : 'Transfer'}
                        </button>
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
                        Wallet supports transaction versions:{' '}
                        {supportedTransactionVersions.length ? supportedTransactionVersions.join(', ') : 'unknown'}.
                        Sending as version {version}.
                    </div>
                </div>

                {lastSignature ? (
                    <PlaygroundTxSuccess
                        cluster={cluster}
                        signature={lastSignature}
                        title={`You transferred tokens with a version ${lastVersion} transaction!`}
                    />
                ) : null}
                {hasError ? (
                    <PlaygroundErrorPanel error={error} onClose={() => resetError()} title="Transfer failed" />
                ) : null}
            </form>
        </div>
    );
}
