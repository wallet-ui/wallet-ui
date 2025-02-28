import { AppModal } from '@/components/app-layout';
import { Address } from 'gill';

export function AccountUiModalReceive({
    open,
    setOpen,
    address,
}: {
    setOpen: (open: boolean) => void;
    open: boolean;
    address: Address;
}) {
    return (
        <AppModal
            title="Receive"
            description="Receive assets by sending them to your public key:"
            open={open}
            onOpenChange={setOpen}
        >
            <p>Receive assets by sending them to your public key:</p>
            <code>{address.toString()}</code>
        </AppModal>
    );
}
