import { useGetSignatures } from '@/components/account/data-access/use-get-signatures';
import { ExplorerLink } from '@/components/explorer-link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ellipsify } from '@/lib/utils';
import { Address } from 'gill';
import { RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';

export function AccountUiTransactions({ address }: { address: Address }) {
    const query = useGetSignatures({ address });
    const [showAll, setShowAll] = useState(false);

    const items = useMemo(() => {
        if (showAll) return query.data;
        return query.data?.slice(0, 5);
    }, [query.data, showAll]);

    return (
        <div className="space-y-2">
            <div className="flex justify-between">
                <h2 className="text-2xl font-bold">Transaction History</h2>
                <div className="space-x-2">
                    {query.isLoading ? (
                        <span className="loading loading-spinner">Loading...</span>
                    ) : (
                        <Button variant="outline" disabled={query.isLoading} onClick={() => query.refetch()}>
                            <RefreshCw size={16} />
                        </Button>
                    )}
                </div>
            </div>
            {query.isError && <pre className="alert alert-error">Error: {query.error?.message.toString()}</pre>}
            {query.isSuccess && (
                <div>
                    {query.data.length === 0 ? (
                        <div>No transactions found.</div>
                    ) : (
                        <Table className="border">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Signature</TableHead>
                                    <TableHead className="text-right">Slot</TableHead>
                                    <TableHead>Block Time</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items?.map(item => (
                                    <TableRow key={item.signature}>
                                        <TableHead className="font-mono">
                                            <ExplorerLink
                                                path={`tx/${item.signature}`}
                                                label={ellipsify(item.signature, 8)}
                                            />
                                        </TableHead>
                                        <TableCell className="font-mono text-right">
                                            <ExplorerLink path={`block/${item.slot}`} label={item.slot.toString()} />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                (parseInt(item.blockTime?.toString() ?? '0') ?? 0) * 1000,
                                            ).toISOString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {item.err ? (
                                                <div className="badge badge-error" title={item.err?.toString()}>
                                                    Failed
                                                </div>
                                            ) : (
                                                <div className="badge badge-success">Success</div>
                                            )}
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
