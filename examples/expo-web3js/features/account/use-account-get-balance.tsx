import { useQuery } from '@tanstack/react-query';
import { PublicKey } from '@solana/web3.js';
import { useSolanaMobile } from '@wallet-ui/react-native-web3js';

export function useAccountGetBalance({ publicKey }: { publicKey: PublicKey }) {
    const { connection, clusterId } = useSolanaMobile();
    return useQuery({
        queryKey: ['get-balance', clusterId, publicKey.toString()],
        queryFn: () => connection.getBalance(publicKey),
    });
}
