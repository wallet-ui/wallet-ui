import { UiWallet, useWallets } from '@wallet-standard/react';

import { WalletGrid } from './wallet-grid.tsx';

export default function Wallets() {
    const wallets: UiWallet[] = useWallets();
    const filtered: UiWallet[] = wallets
        // Remove any non-Solana wallets
        .filter(wallet => wallet.chains?.some(chain => chain.startsWith('solana:')));

    return <WalletGrid wallets={filtered} />;
}
