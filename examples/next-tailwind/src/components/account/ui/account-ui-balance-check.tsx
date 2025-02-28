import { useGetBalance } from '@/components/account/data-access/use-get-balance';
import { useRequestAirdrop } from '@/components/account/data-access/use-request-airdrop';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useSolanaChain } from '@wallet-ui/react';
import { Address } from 'gill';

export function AccountUiBalanceCheck({ address }: { address: Address }) {
    const { chain } = useSolanaChain();
    const mutation = useRequestAirdrop({ address });
    const query = useGetBalance({ address });

    if (query.isLoading) {
        return 'Loading...';
    }
    if (query.isError || !query.data) {
        return (
            <Alert variant="warning">
                <AlertTitle>
                    You are connected to <strong>{chain.label}</strong> but your account is not found on this cluster.
                </AlertTitle>
                <AlertDescription>
                    <Button onClick={() => mutation.mutateAsync(1).catch(err => console.log(err))}>
                        Request Airdrop
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }
    return null;
}
