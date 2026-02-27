import { PublicKey } from '@solana/web3.js';
import { Button, View } from 'react-native';
import { appStyles } from '@/constants/app-styles';
import { toUint8Array, useMobileWallet } from '@wallet-ui/react-native-web3js';
import { useState } from 'react';

export function AccountFeatureSignMessages({ address }: { address: PublicKey }) {
    const { signMessage } = useMobileWallet();
    const [title, setTitle] = useState('Sign Multiple Messages');
    async function submit() {
        try {
            const messages = [
                toUint8Array(`Message 1 from ${address.toString()}`),
                toUint8Array(`Message 2 from ${address.toString()}`),
            ];
            const signedMessages = await signMessage(messages);
            setTitle(`${signedMessages.length} Messages Signed!`);
            console.log(`${signedMessages.length} messages signed!`);
        } catch (e) {
            setTitle('Sign Messages Failed');
            console.log(`Error signing messages: ${e}`);
        }
    }
    return (
        <View style={appStyles.stack}>
            <Button onPress={submit} title={title} />
        </View>
    );
}
