import { useQuery } from '@tanstack/react-query';
import { useSolanaChain, useSolanaRpc } from '@wallet-ui/react';
import { Address } from 'gill';

export function useGetSignatures({ address }: { address: Address }) {
    const { chain } = useSolanaChain();
    const { rpc } = useSolanaRpc();

    return useQuery({
        queryKey: ['get-signatures', { chain, address }],
        queryFn: () => rpc.getSignaturesForAddress(address).send(),
    });
}
