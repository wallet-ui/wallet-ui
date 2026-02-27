import { useState } from 'react';
import { Button, View } from 'react-native';
import { appStyles } from '@/constants/app-styles';
import { useMobileWallet } from '@wallet-ui/react-native-kit';
import { Address } from '@solana/kit';

export function AccountFeatureSignMessages({ address }: { address: Address }) {
    const { signMessage } = useMobileWallet();
    const [title, setTitle] = useState('Sign Multiple Messages');
    async function submit() {
        try {
            const messages = [
                new TextEncoder().encode(`Message 1 from ${address}`),
                new TextEncoder().encode(`Message 2 from ${address}`),
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
