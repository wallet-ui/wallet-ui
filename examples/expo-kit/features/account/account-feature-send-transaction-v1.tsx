import { Button, View } from 'react-native';
import { appStyles } from '@/constants/app-styles';
import { getAddMemoInstruction } from '@solana-program/memo';
import { useMobileWallet } from '@wallet-ui/react-native-kit';
import { Address } from '@solana/kit';
import { useState } from 'react';

/**
 * A memo this long cannot fit in a legacy or version 0 transaction (1232 bytes max), so the transaction only lands
 * because it is sent as version 1 (4096 bytes max). The connected wallet must report `1` in
 * `getCapabilities().supported_transaction_versions`.
 */
const LARGE_MEMO_LENGTH = 1_500;

export function AccountFeatureSendTransactionV1({ address }: { address: Address }) {
    const { sendTransactions } = useMobileWallet();
    const [title, setTitle] = useState('Send v1 transaction');

    async function submit() {
        try {
            const memo = `v1 from Mobile Wallet Adapter - ${address} `.padEnd(LARGE_MEMO_LENGTH, '.');
            // Without explicit resource limits, `sendTransactions` simulates the version 1 transaction to set them.
            const signature = await sendTransactions([getAddMemoInstruction({ memo })], { version: 1 });

            console.log(`Sent v1 transaction: ${signature}!`);
            setTitle('v1 Transaction Sent!');
        } catch (e) {
            setTitle('Send v1 Transaction Failed');
            console.log(`Error sending v1 transaction: ${e}`);
        }
    }

    return (
        <View style={appStyles.stack}>
            <Button onPress={submit} title={title} />
        </View>
    );
}
