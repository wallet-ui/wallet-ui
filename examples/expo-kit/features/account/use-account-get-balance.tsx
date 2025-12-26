import { useQuery } from '@tanstack/react-query';
import { useMobileWallet } from '@/src';
import { Address } from '@solana/kit';

export function useAccountGetBalance({ publicKey }: { publicKey: Address }) {
    const { chain, client } = useMobileWallet();
    return useQuery({
        queryKey: ['get-balance', chain, publicKey],
        queryFn: () => client.rpc.getBalance(publicKey).send(),
    });
}
