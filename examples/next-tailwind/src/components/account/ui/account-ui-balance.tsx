import { useGetBalance } from '@/components/account/data-access/use-get-balance';
import { AccountUiBalanceSol } from '@/components/account/ui/account-ui-balance-sol';
import { Address } from 'gill';

export function AccountUiBalance({ address }: { address: Address }) {
    const query = useGetBalance({ address });

    return (
        <div>
            <h1 className="text-5xl font-bold cursor-pointer" onClick={() => query.refetch()}>
                {query.data ? <AccountUiBalanceSol balance={query.data} /> : '...'}
            </h1>
        </div>
    );
}
