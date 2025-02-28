import { useQuery } from '@tanstack/react-query';
import { useSolanaChain, useSolanaRpc } from '@wallet-ui/react';
import { Address } from 'gill';
import { TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from 'gill/programs/token';

export function useGetTokenAccounts({ address }: { address: Address }) {
    const { chain } = useSolanaChain();
    const { rpc } = useSolanaRpc();

    return useQuery({
        queryKey: ['get-token-accounts', { chain, address }],
        queryFn: async () =>
            Promise.all([
                rpc
                    .getTokenAccountsByOwner(
                        address,
                        { programId: TOKEN_PROGRAM_ADDRESS },
                        { commitment: 'confirmed', encoding: 'jsonParsed' },
                    )
                    .send()
                    .then(res => res.value ?? []),
                rpc
                    .getTokenAccountsByOwner(
                        address,
                        { programId: TOKEN_2022_PROGRAM_ADDRESS },
                        { commitment: 'confirmed', encoding: 'jsonParsed' },
                    )
                    .send()
                    .then(res => res.value ?? []),
            ]).then(([tokenAccounts, token2022Accounts]) => [...tokenAccounts, ...token2022Accounts]),
    });
}
