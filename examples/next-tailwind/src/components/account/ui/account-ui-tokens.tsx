import { useGetTokenAccounts } from '@/components/account/data-access/use-get-token-accounts';
import { ExplorerLink } from '@/components/explorer-link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ellipsify } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Address } from 'gill';
import { RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';

export function AccountUiTokens({ address }: { address: Address }) {
    const [showAll, setShowAll] = useState(false);
    const query = useGetTokenAccounts({ address });
    const client = useQueryClient();
    const items = useMemo(() => {
        if (showAll) return query.data;
        return query.data?.slice(0, 5);
    }, [query.data, showAll]);

    return (
        <div className="space-y-2">
            <div className="justify-between">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold">Token Accounts</h2>
                    <div className="flex flex-col space-x-2">
                        {query.isLoading ? (
                            <span className="loading loading-spinner">Loading...</span>
                        ) : (
                            <Button
                                variant="outline"
                                disabled={query.isLoading}
                                onClick={async () => {
                                    await query.refetch();
                                    await client.invalidateQueries({
                                        queryKey: ['getTokenAccountBalance'],
                                    });
                                }}
                            >
                                <RefreshCw size={16} />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            {query.isError && <pre className="alert alert-error">Error: {query.error?.message.toString()}</pre>}
            {query.isSuccess && (
                <div>
                    {query.data.length === 0 ? (
                        <div>No token accounts found.</div>
                    ) : (
                        <Table className="border">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Public Key</TableHead>
                                    <TableHead>Mint</TableHead>
                                    <TableHead className="text-right">Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items?.map(({ account, pubkey }) => (
                                    <TableRow key={pubkey.toString()}>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <span className="font-mono">
                                                    <ExplorerLink
                                                        label={ellipsify(pubkey.toString())}
                                                        path={`account/${pubkey.toString()}`}
                                                    />
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <span className="font-mono">
                                                    <ExplorerLink
                                                        label={ellipsify(account.data.parsed.info.mint)}
                                                        path={`account/${account.data.parsed.info.mint}`}
                                                    />
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className="font-mono">
                                                {account.data.parsed.info.tokenAmount?.uiAmount ?? 0}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {(query.data?.length ?? 0) > 5 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            <Button variant="outline" onClick={() => setShowAll(!showAll)}>
                                                {showAll ? 'Show Less' : 'Show All'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
            )}
        </div>
    );
}
