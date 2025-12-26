import { Button, View } from 'react-native';
import { appStyles } from '@/constants/app-styles';
import { toUint8Array, useMobileWallet } from '@/src';
import { Address } from '@solana/kit';

export function AccountFeatureSignMessage({ publicKey }: { publicKey: Address }) {
    const { signMessage } = useMobileWallet();
    async function submit() {
        try {
            await signMessage(toUint8Array(`Signing a message with ${publicKey}`));
            console.log('Message signed!');
        } catch (e) {
            console.log(`Error signing message: ${e}`);
        }
    }
    return (
        <View style={appStyles.stack}>
            <Button onPress={submit} title="Sign Message" />
        </View>
    );
}
