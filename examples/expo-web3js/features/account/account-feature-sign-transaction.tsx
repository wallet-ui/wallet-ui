import { PublicKey, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { Button, View } from 'react-native';
import { appStyles } from '@/constants/app-styles';
import { createMemoInstruction } from '@solana/spl-memo';
import { useMobileWallet } from '@wallet-ui/react-native-web3js';

export function AccountFeatureSignTransaction({ address }: { address: PublicKey }) {
    const { connection, signTransaction } = useMobileWallet();

    async function submit() {
        try {
            const { value: latestBlockhash } = await connection.getLatestBlockhashAndContext();

            const message = new TransactionMessage({
                payerKey: address,
                recentBlockhash: latestBlockhash.blockhash,
                instructions: [createMemoInstruction('Signed with Mobile Wallet Adapter')],
            }).compileToV0Message();

            const transaction = new VersionedTransaction(message);

            const signedTransaction = await signTransaction(transaction);

            console.log('Transaction signed successfully!', signedTransaction);
        } catch (e) {
            console.log(`Error signing transaction: ${e}`);
        }
    }

    return (
        <View style={appStyles.stack}>
            <Button onPress={submit} title="Sign transaction" />
        </View>
    );
}
