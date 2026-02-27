import { PublicKey, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { Button, View } from 'react-native';
import { appStyles } from '@/constants/app-styles';
import { createMemoInstruction } from '@solana/spl-memo';
import { useMobileWallet } from '@wallet-ui/react-native-web3js';
import { useState } from 'react';

export function AccountFeatureSendTransactions({ address }: { address: PublicKey }) {
    const { connection, signAndSendTransaction } = useMobileWallet();
    const [title, setTitle] = useState('Send Multiple Transactions');

    async function submit() {
        try {
            const {
                context: { slot: minContextSlot },
                value: latestBlockhash,
            } = await connection.getLatestBlockhashAndContext();

            const transactions = [1, 2].map(i => {
                const message = new TransactionMessage({
                    payerKey: address,
                    recentBlockhash: latestBlockhash.blockhash,
                    instructions: [createMemoInstruction(`Hello #${i} from Mobile Wallet Adapter`)],
                }).compileToLegacyMessage();
                return new VersionedTransaction(message);
            });

            const signatures = await signAndSendTransaction(transactions, minContextSlot);

            for (const signature of signatures) {
                await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');
            }

            setTitle(`${signatures.length} Transactions Sent!`);
            console.log(`Sent ${signatures.length} transactions: ${signatures.join(', ')}!`);
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
