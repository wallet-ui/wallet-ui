import { SignatureBytes, Transaction, TransactionVersion } from '@solana/kit';

export type TransactionSignatures<T extends Transaction | Transaction[]> = T extends unknown[]
    ? SignatureBytes[]
    : SignatureBytes;

export type SendTransactionsOptions = Readonly<{
    /**
     * Compute unit limit to set on the transaction message. When omitted for a version 1 transaction, the limit is
     * estimated by simulating the transaction.
     */
    computeUnitLimit?: number;
    /**
     * Whether to simulate the transaction to estimate and set the resource limits the call did not provide.
     *
     * Defaults to `true` for version 1 transactions that are missing a resource limit, and `false` otherwise. A version
     * 1 transaction is budgeted zero compute units when it carries no compute unit limit.
     */
    estimateResourceLimits?: boolean;
    /**
     * Loaded accounts data size limit to set on the transaction message. Only meaningful for version 1 transactions;
     * when omitted for a version 1 transaction, the limit is estimated by simulating the transaction.
     */
    loadedAccountsDataSizeLimit?: number;
    /**
     * The transaction message version to build. Defaults to `0`. Pass `1` only when the connected wallet reports `1`
     * in its `getCapabilities().supported_transaction_versions`.
     */
    version?: TransactionVersion;
}>;
