import { useQuery } from '@tanstack/react-query';
import { useSolanaChain, useSolanaRpc } from '@wallet-ui/react';
import { Address } from 'gill';

export function useGetBalance({ address }: { address: Address }) {
    const { chain } = useSolanaChain();
    const { rpc } = useSolanaRpc();

    return useQuery({
        queryKey: ['get-balance', { chain, address }],
        queryFn: () =>
            rpc
                .getBalance(address)
                .send()
                .then(res => res.value),
    });
}
