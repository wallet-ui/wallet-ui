import { WalletConnectButton } from "../wallets/wallet-connect-button";
import { UiWallet, useWallets } from '@wallet-standard/react';

export default function Dev() {
    const wallets: UiWallet[] = useWallets();
    const filtered: UiWallet[] = wallets
        .filter(wallet => wallet.chains?.some(chain => chain.startsWith('solana:')));

    return (
        <div>
            <pre>{JSON.stringify({ page: 'DEV' }, null, 4)}</pre>
            <WalletConnectButton wallets={filtered} />
        </div>
    );
}
