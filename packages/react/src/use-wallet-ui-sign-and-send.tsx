import type { IInstruction, TransactionSendingSigner } from 'gill';
import { createTransaction, getBase58Decoder, signAndSendTransactionMessageWithSigners } from 'gill';

import { useWalletUi } from './use-wallet-ui';

export function useWalletUiSignAndSend() {
    const { client } = useWalletUi();

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
