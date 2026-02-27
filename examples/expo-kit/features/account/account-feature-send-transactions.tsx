import { Button, View } from 'react-native';
import { appStyles } from '@/constants/app-styles';
import { getAddMemoInstruction } from '@solana-program/memo';
import { useMobileWallet } from '@wallet-ui/react-native-kit';
import {
    Address,
    appendTransactionMessageInstructions,
    compileTransaction,
    createTransactionMessage,
    getBase58Decoder,
    pipe,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
} from '@solana/kit';
import { useState } from 'react';

export function AccountFeatureSendTransactions({ address }: { address: Address }) {
    const { signAndSendTransaction, getTransactionSigner, client } = useMobileWallet();
    const [title, setTitle] = useState('Send Multiple Transactions');

    async function submit() {
        try {
            const {
                context: { slot: minContextSlot },
                value: latestBlockhash,
            } = await client.rpc.getLatestBlockhash().send();

            const signer = getTransactionSigner(address, minContextSlot);

            const transactions = [1, 2].map(i =>
                compileTransaction(
                    pipe(
                        createTransactionMessage({ version: 0 }),
                        tx =>
                            appendTransactionMessageInstructions(
                                [getAddMemoInstruction({ memo: `Hello #${i} from Mobile Wallet Adapter - ${address}` })],
                                tx,
                            ),
                        tx => setTransactionMessageFeePayerSigner(signer, tx),
                        tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
                    ),
                ),
            );

            const signatureBytes = await signAndSendTransaction(transactions, minContextSlot);
            const decoder = getBase58Decoder();

            for (const sig of signatureBytes) {
                console.log(`Sent transaction: ${decoder.decode(sig)}!`);
            }

            setTitle(`${signatureBytes.length} Transactions Sent!`);
        } catch (e) {
            setTitle('Send Transactions Failed');
            console.log(`Error sending transactions: ${e}`);
        }
    }

    return (
        <View style={appStyles.stack}>
            <Button onPress={submit} title={title} />
        </View>
    );
}
