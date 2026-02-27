import { PublicKey, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { Button, View } from 'react-native';
import { appStyles } from '@/constants/app-styles';
import { createMemoInstruction } from '@solana/spl-memo';
import { useMobileWallet } from '@wallet-ui/react-native-web3js';

export function AccountFeatureSendTransaction({ address }: { address: PublicKey }) {
    const { connection, signAndSendTransaction } = useMobileWallet();

    async function submit() {
        try {
            const {
                context: { slot: minContextSlot },
                value: latestBlockhash,
            } = await connection.getLatestBlockhashAndContext();

            const message = new TransactionMessage({
                payerKey: address,
                recentBlockhash: latestBlockhash.blockhash,
                instructions: [
                    // You can add more instructions here
                    createMemoInstruction('Hello from Mobile Wallet Adapter'),
                ],
            }).compileToLegacyMessage();

            const transaction = new VersionedTransaction(message);

            const signatures = await signAndSendTransaction(transaction, minContextSlot);

            for (const signature of signatures) {
                await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');
            }

            console.log(`Sent ${signatures.length} transaction(s): ${signatures.join(', ')}!`);
        } catch (e) {
            console.log(`Error sending transaction: ${e}`);
        }
    }
    return (
        <View style={appStyles.stack}>
            <Button onPress={submit} title="Send transaction" />
        </View>
    );
}
