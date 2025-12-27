import type { Instruction, TransactionSendingSigner } from '@solana/kit';
import {
    appendTransactionMessageInstructions,
    createTransactionMessage,
    getBase58Decoder,
    pipe,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    signAndSendTransactionMessageWithSigners,
} from '@solana/kit';

import { useWalletUiKit } from './use-wallet-ui-kit';

export function useWalletUiSignAndSend() {
    const client = useWalletUiKit();

    return async (ix: Instruction | Instruction[], signer: TransactionSendingSigner) => {
        const instructions = Array.isArray(ix) ? ix : [ix];
        const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send();
        const transaction = pipe(
            createTransactionMessage({ version: 0 }),
            msg => appendTransactionMessageInstructions(instructions, msg),
            tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
            tx => setTransactionMessageFeePayerSigner(signer, tx),
            tx => appendTransactionMessageInstructions(instructions, tx),
        );

        const signature = await signAndSendTransactionMessageWithSigners(transaction);

        return getBase58Decoder().decode(signature);
    };
}
