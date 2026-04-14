import { PublicKey } from '@solana/web3.js';
import { Button, View } from 'react-native';
import { appStyles } from '@/constants/app-styles';
import { useMobileWallet } from '@wallet-ui/react-native-web3js';
import { useState } from 'react';

export function AccountFeatureSignMessage({ address }: { address: PublicKey }) {
    const { signMessages } = useMobileWallet();
    const [title, setTitle] = useState('Sign Message');

    async function submit() {
        try {
            await signMessages(new TextEncoder().encode(`Signing a message with ${address.toString()}`));
            setTitle('Message Signed!');
            console.log('Message signed!');
        } catch (e) {
            setTitle('Sign Message Failed');
            console.log(`Error signing message: ${e}`);
        }
    }
    return (
        <View style={appStyles.stack}>
            <Button onPress={submit} title={title} />
        </View>
    );
}
