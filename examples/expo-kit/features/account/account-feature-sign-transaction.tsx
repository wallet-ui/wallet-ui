import { Button, View } from 'react-native';
import { appStyles } from '@/constants/app-styles';
import { getAddMemoInstruction } from '@solana-program/memo';
import { useMobileWallet } from '@wallet-ui/react-native-kit';
import {
    Address,
    appendTransactionMessageInstructions,
    createTransactionMessage,
    Instruction,
    pipe,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
} from '@solana/kit';

export function AccountFeatureSignTransaction({ address }: { address: Address }) {
    const { signTransaction, getTransactionSigner, client } = useMobileWallet();

    async function submit() {
        try {
            const {
                context: { slot: minContextSlot },
                value: latestBlockhash,
            } = await client.rpc.getLatestBlockhash().send();

            const signer = getTransactionSigner(address, minContextSlot);

            const instructions: Instruction[] = [
                getAddMemoInstruction({ memo: `Signed with Mobile Wallet Adapter - ${address}` }),
            ];

            const transactionMessage = pipe(
                createTransactionMessage({ version: 0 }),
                tx => appendTransactionMessageInstructions(instructions, tx),
                tx => setTransactionMessageFeePayerSigner(signer, tx),
                tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
            );

            const signedTransaction = await signTransaction(transactionMessage);

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
