'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useSolanaChain, useSolanaRpc } from '@wallet-ui/react';
import { ReactNode } from 'react';

export function ClusterChecker({ children }: { children: ReactNode }) {
    const { chain } = useSolanaChain();
    const { rpc } = useSolanaRpc();

    const query = useQuery({
        queryKey: ['version', { chain }],
        queryFn: () => rpc.getVersion().send(),
        retry: 1,
    });
    if (query.isLoading) {
        return null;
    }
    if (query.isError || !query.data) {
        return (
            <Alert variant="warning">
                <AlertTitle>
                    Error connecting to chain <strong>{chain.label}</strong>
                </AlertTitle>
                <AlertDescription>
                    <Button onClick={() => query.refetch().catch(err => console.log(err))}>Refresh</Button>
                </AlertDescription>
            </Alert>
        );
    }
    return children;
}
