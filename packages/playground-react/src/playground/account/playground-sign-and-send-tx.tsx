import {
    getUiWalletAccountStorageKey,
    type UiWalletAccount,
    useWalletAccountTransactionSendingSigner,
    useWallets,
    useWalletUi,
    useWalletUiCluster,
} from '@wallet-ui/react';
import {
    assertIsTransactionMessageWithSingleSendingSigner,
    createTransactionMessage,
    pipe,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    signAndSendTransactionMessageWithSigners,
} from 'gill';
import type { SyntheticEvent } from 'react';
import React, { useMemo, useState } from 'react';
import { solStringToLamports } from '../../util/sol-string-to-lamports';
import { useError } from '../../util/use-error';

import { PlaygroundErrorPanel } from '../playground-error-panel';
import { PlaygroundTxSuccess } from '../playground-tx-success';

export function PlaygroundSignAndSendTx({ account }: { account: UiWalletAccount }) {
    const { error, hasError, setError, resetError } = useError();
    const { cluster } = useWalletUiCluster();
    const { client } = useWalletUi();
    const wallets = useWallets();
    const [isSendingTransaction, setIsSendingTransaction] = useState(false);
    const [lastSignature, setLastSignature] = useState<Uint8Array | undefined>();
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
    const transactionSendingSigner = useWalletAccountTransactionSendingSigner(account, cluster.id);

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
                createTransactionMessage({ version: 0 }),
                m => setTransactionMessageFeePayerSigner(transactionSendingSigner, m),
                m => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
                // m =>
                //     appendTransactionMessageInstruction(
                // TODO: Gill does not export this getTransferSolInstruction?
                //         getTransferSolInstruction({
                //             amount,
                //             destination: address(recipientAccount.address),
                //             source: transactionSendingSigner,
                //         }),
                //         m,
                //     ),
            );
            assertIsTransactionMessageWithSingleSendingSigner(message);
            const signature = await signAndSendTransactionMessageWithSigners(message);

            setLastSignature(signature);
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
                </div>

                {lastSignature ? (
                    <PlaygroundTxSuccess cluster={cluster} signature={lastSignature} title="You transferred tokens!" />
                ) : null}
                {hasError ? (
                    <PlaygroundErrorPanel error={error} onClose={() => resetError()} title="Transfer failed" />
                ) : null}
            </form>
        </div>
    );
}
