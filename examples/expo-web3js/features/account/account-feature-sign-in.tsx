import { Button, View } from 'react-native';
import { appStyles } from '@/constants/app-styles';
import { Account, useMobileWallet } from '@wallet-ui/react-native-web3js';
import { AppConfig } from '@/constants/app-config';

export function AccountFeatureSignIn({ account }: { account?: Account }) {
    const { signIn } = useMobileWallet();
    async function submit() {
        try {
            await signIn({ address: account?.publicKey?.toString(), uri: AppConfig.identity.uri });
            console.log('Signed in!');
        } catch (e) {
            console.log(`Error signing in: ${e}`);
        }
    }
    return (
        <View style={appStyles.stack}>
            <Button onPress={submit} title={`Sign In ${account ? `with ${account.label}` : 'and connect'}`} />
        </View>
    );
}
