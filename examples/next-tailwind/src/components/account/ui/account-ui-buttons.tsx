import { AccountUiModalAirdrop } from '@/components/account/ui/account-ui-modal-airdrop';
import { AccountUiModalReceive } from '@/components/account/ui/account-ui-modal-receive';
import { AccountUiModalSend } from '@/components/account/ui/account-ui-modal-send';
import { useSolanaChain, useSolanaWallet } from '@wallet-ui/react';
import { Address } from 'gill';
import { useState } from 'react';

export function AccountUiButtons({ address }: { address: Address }) {
    const { chain } = useSolanaChain();
    const isMainnet = chain.id === 'solana:mainnet';
    const [airdropOpen, setAirdropOpen] = useState(false);
    const [receiveOpen, setReceiveOpen] = useState(false);
    const [sendOpen, setSendOpen] = useState(false);
    const [account] = useSolanaWallet();

    const canSend = address && account?.features.includes('solana:signAndSendTransaction');

    return (
        <div className="flex gap-2 whitespace-nowrap">
            {isMainnet ? null : <AccountUiModalAirdrop address={address} open={airdropOpen} setOpen={setAirdropOpen} />}
            <AccountUiModalReceive address={address} open={receiveOpen} setOpen={setReceiveOpen} />
            {account && canSend ? (
                <AccountUiModalSend address={address} open={sendOpen} setOpen={setSendOpen} account={account} />
            ) : null}
        </div>
    );
}
