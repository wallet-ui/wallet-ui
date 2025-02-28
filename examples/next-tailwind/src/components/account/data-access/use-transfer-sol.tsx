import { createTransaction } from '@/components/account/data-access/create-transaction';
import { useToastTransaction } from '@/hooks/use-toast-transaction';
import { useWalletAccountTransactionSendingSigner } from '@solana/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UiWalletAccount } from '@wallet-standard/react';
import { useSolanaChain, useSolanaRpc } from '@wallet-ui/react';
import { Address } from 'gill';
import { toast } from 'sonner';

export function useTransferSol({ address, account }: { address: Address; account: UiWalletAccount }) {
    const { chain } = useSolanaChain();

    const toastTransaction = useToastTransaction();
    const { rpc } = useSolanaRpc();
    const txSigner = useWalletAccountTransactionSendingSigner(account, chain.id);
    const client = useQueryClient();

    return useMutation({
        mutationKey: ['transfer-sol', { chain, address }],
        mutationFn: async (input: { destination: Address; amount: number }) => {
            try {
                const { signature } = await createTransaction({
                    txSigner,
                    destination: input.destination,
                    amount: input.amount,
                    rpc,
                });

                console.log(signature);
                return signature;
            } catch (error: unknown) {
                console.log('error', `Transaction failed! ${error}`);

                return;
            }
        },
        onSuccess: signature => {
            if (signature?.length) {
                toastTransaction(signature);
            }
            return Promise.all([
                client.invalidateQueries({
                    queryKey: ['get-balance', { chain, address }],
                }),
                client.invalidateQueries({
                    queryKey: ['get-signatures', { chain, address }],
                }),
            ]);
        },
        onError: error => {
            toast.error(`Transaction failed! ${error}`);
        },
    });
}
