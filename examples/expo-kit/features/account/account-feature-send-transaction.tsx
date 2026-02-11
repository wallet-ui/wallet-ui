import { Button, View } from 'react-native';
import { appStyles } from '@/constants/app-styles';
import { getAddMemoInstruction } from '@solana-program/memo';
import { useMobileWallet } from '@wallet-ui/react-native-kit';
import { Address, Instruction } from '@solana/kit';

export function AccountFeatureSendTransaction({ address }: { address: Address }) {
    const { sendTransaction } = useMobileWallet();

    async function submit() {
        console.log('submit');
        try {
            const instructions: Instruction[] = [
                // You can add more instructions here
                getAddMemoInstruction({ memo: `gm from Mobile Wallet Adapter - ${address}` }),
            ];

            const signature = await sendTransaction(instructions);

            console.log(`Sent transaction: ${signature}!`);
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
