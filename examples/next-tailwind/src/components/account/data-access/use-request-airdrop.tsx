import { useToastTransaction } from '@/hooks/use-toast-transaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSolanaChain, useSolanaRpc } from '@wallet-ui/react';
import { Address, airdropFactory, lamports } from 'gill';

export function useRequestAirdrop({ address }: { address: Address }) {
    const { chain } = useSolanaChain();
    const { rpc, rpcSubscriptions } = useSolanaRpc();
    const client = useQueryClient();
    const toastTransaction = useToastTransaction();
    const airdrop = airdropFactory({ rpc, rpcSubscriptions });

    return useMutation({
        mutationKey: ['airdrop', { chain, address }],
        mutationFn: async (amount: number = 1) =>
            airdrop({
                commitment: 'confirmed',
                recipientAddress: address,
                lamports: lamports(BigInt(Math.round(amount * 1_000_000_000))),
            }),
        onSuccess: signature => {
            toastTransaction(signature);
            return Promise.all([
                client.invalidateQueries({ queryKey: ['get-balance', { chain, address }] }),
                client.invalidateQueries({ queryKey: ['get-signatures', { chain, address }] }),
            ]);
        },
    });
}
