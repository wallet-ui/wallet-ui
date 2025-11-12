import { useSolana } from '@/features/solana/solana-provider';
import { useQuery } from '@tanstack/react-query';
import { PublicKey } from '@solana/web3.js';

export function useAccountGetBalance({ publicKey }: { publicKey: PublicKey }) {
    const { connection, network } = useSolana();
    return useQuery({
        queryKey: ['get-balance', network.id, publicKey.toString()],
        queryFn: () => connection.getBalance(publicKey),
    });
}
