import { useTransferSol } from '@/components/account/data-access/use-transfer-sol';
import { AppModal } from '@/components/app-layout';
import { Input } from '@/components/ui/input';
import { UiWalletAccount } from '@wallet-standard/react';
import { address as addressUtil, Address } from 'gill';
import { useState } from 'react';

export function AccountUiModalSend({
    account,
    address,
    open,
    setOpen,
}: {
    account: UiWalletAccount;
    address: Address;
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    const mutation = useTransferSol({ address, account });
    const [destination, setDestination] = useState('');
    const [amount, setAmount] = useState('1');

    const canSend = address && account?.features.includes('solana:signAndSendTransaction');

    return (
        <AppModal
            open={open}
            onOpenChange={setOpen}
            title="Send"
            disabled={!canSend}
            description="Send SOL to another account."
            submitDisabled={!destination || !amount || mutation.isPending}
            submitLabel="Send"
            submit={() => {
                mutation
                    .mutateAsync({
                        destination: addressUtil(destination),
                        amount: parseFloat(amount),
                    })
                    .then(() => setOpen(false));
            }}
        >
            <Input
                disabled={mutation.isPending}
                type="text"
                placeholder="Destination"
                className="input input-bordered w-full"
                value={destination}
                onChange={e => setDestination(e.target.value)}
            />
            <Input
                disabled={mutation.isPending}
                type="number"
                step="any"
                min="1"
                placeholder="Amount"
                className="input input-bordered w-full"
                value={amount}
                onChange={e => setAmount(e.target.value)}
            />
        </AppModal>
    );
}
