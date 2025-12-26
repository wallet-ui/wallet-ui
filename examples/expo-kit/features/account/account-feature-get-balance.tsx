import { Text } from 'react-native';
import { LAMPORTS_PER_SOL } from '@/src';
import { useAccountGetBalance } from '@/features/account/use-account-get-balance';
import { Address } from '@solana/kit';

export function AccountFeatureGetBalance({ publicKey }: { publicKey: Address }) {
    const { data, isLoading } = useAccountGetBalance({ publicKey });

    return <Text>Balance: {isLoading ? '...' : `${data?.value ? data?.value : 0 / LAMPORTS_PER_SOL} SOL`}</Text>;
}
