import { SignatureBytes, Transaction } from '@solana/kit';

export type TransactionSignatures<T extends Transaction | Transaction[]> = T extends unknown[]
    ? SignatureBytes[]
    : SignatureBytes;
