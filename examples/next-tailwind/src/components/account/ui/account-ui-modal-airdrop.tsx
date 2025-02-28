import { useRequestAirdrop } from '@/components/account/data-access/use-request-airdrop';
import { AppModal } from '@/components/app-layout';
import { Input } from '@/components/ui/input';
import { Address } from 'gill';
import { useState } from 'react';

export function AccountUiModalAirdrop({
    open,
    setOpen,
    address,
}: {
    setOpen: (open: boolean) => void;
    open: boolean;
    address: Address;
}) {
    const mutation = useRequestAirdrop({ address });
    const [amount, setAmount] = useState('2');

    return (
        <AppModal
            open={open}
            onOpenChange={setOpen}
            title="Airdrop"
            description="Request airdrop of SOL to your account."
            submitDisabled={!amount || mutation.isPending}
            submitLabel="Request Airdrop"
            submit={() => mutation.mutateAsync(parseFloat(amount)).then(() => setOpen(false))}
        >
            <Input
                disabled={mutation.isPending}
                type="number"
                step="any"
                min="1"
                placeholder="Amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
            />
        </AppModal>
    );
}
