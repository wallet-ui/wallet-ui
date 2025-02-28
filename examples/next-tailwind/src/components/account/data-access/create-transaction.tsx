import { SolanaRpc } from '@wallet-ui/react';
import {
    address,
    Address,
    appendTransactionMessageInstruction,
    assertIsTransactionMessageWithSingleSendingSigner,
    type Blockhash,
    createTransactionMessage,
    getBase58Decoder,
    pipe,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    signAndSendTransactionMessageWithSigners,
    TransactionSendingSigner,
} from 'gill';
import { getTransferSolInstruction } from 'gill/programs';

export async function createTransaction({
    amount,
    destination,
    rpc,
    txSigner,
}: {
    amount: number;
    destination: Address;
    rpc: SolanaRpc;
    txSigner: TransactionSendingSigner;
}): Promise<{
    signature: string;
    latestBlockhash: {
        blockhash: Blockhash;
        lastValidBlockHeight: bigint;
    };
}> {
    const { value: latestBlockhash } = await rpc.getLatestBlockhash({ commitment: 'confirmed' }).send();

    const message = pipe(
        createTransactionMessage({ version: 0 }),
        m => setTransactionMessageFeePayerSigner(txSigner, m),
        m => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
        m =>
            appendTransactionMessageInstruction(
                getTransferSolInstruction({
                    amount,
                    destination: address(destination),
                    source: txSigner,
                }),
                m,
            ),
    );
    assertIsTransactionMessageWithSingleSendingSigner(message);

    const signature = await signAndSendTransactionMessageWithSigners(message);

    return {
        signature: getBase58Decoder().decode(signature),
        latestBlockhash,
    };
}
