import { Transaction, TransactionSignature, VersionedTransaction } from '@solana/web3.js';

export type TransactionSignatures<
    T extends (Transaction | VersionedTransaction)[] | Transaction | VersionedTransaction,
> = T extends unknown[] ? TransactionSignature[] : TransactionSignature;
