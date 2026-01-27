import { Button, View } from 'react-native';
import { appStyles } from '@/constants/app-styles';
import { getAddMemoInstruction } from '@solana-program/memo';
import { useMobileWallet } from '@wallet-ui/react-native-kit';
import {
    Address,
    appendTransactionMessageInstructions,
    createTransactionMessage,
    getBase58Decoder,
    Instruction,
    pipe,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    signAndSendTransactionMessageWithSigners,
} from '@solana/kit';

export function AccountFeatureSignTransaction({ address }: { address: Address }) {
    const { client, getTransactionSigner } = useMobileWallet();

    async function submit() {
        console.log('submit');
        try {
            const {
                context: { slot: minContextSlot },
                value: latestBlockhash,
            } = await client.rpc.getLatestBlockhash().send();

            const instructions: Instruction[] = [
                // You can add more instructions here
                getAddMemoInstruction({ memo: 'Hello from Mobile Wallet Adapter' }),
            ];

            // Create an MWA transaction signer
            const signer = getTransactionSigner(address, minContextSlot);

            // const transaction = new VersionedTransaction(message);
            const transaction = pipe(
                createTransactionMessage({ version: 0 }),
                tx => appendTransactionMessageInstructions(instructions, tx),
                tx => setTransactionMessageFeePayerSigner(signer, tx),
                tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
            );

            const signatureBytes = await signAndSendTransactionMessageWithSigners(transaction);
            const signature = getBase58Decoder().decode(signatureBytes);

            console.log(`Signed transaction: ${signature}!`);
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
