import type { IInstruction, TransactionSendingSigner } from 'gill';
import { createTransaction, getBase58Decoder, signAndSendTransactionMessageWithSigners } from 'gill';

import { useWalletUiGill } from './use-wallet-ui-gill';

export function useWalletUiSignAndSend() {
    const client = useWalletUiGill();

    return async (ix: IInstruction | IInstruction[], signer: TransactionSendingSigner) => {
        const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send();

        const transaction = createTransaction({
            feePayer: signer,
            instructions: Array.isArray(ix) ? ix : [ix],
            latestBlockhash,
            version: 0,
        });

        const signature = await signAndSendTransactionMessageWithSigners(transaction);

        return getBase58Decoder().decode(signature);
    };
}
