import { UiStack } from '@wallet-ui/playground-react';
import { UiWallet, useWallets } from '@wallet-ui/react';

import { WalletGrid } from './wallet-grid.tsx';

export default function Wallets() {
    const wallets: readonly UiWallet[] = useWallets();
    const filtered: UiWallet[] = wallets
        // Remove any non-Solana wallets
        .filter(wallet => wallet.chains?.some(chain => chain.startsWith('solana:')));

    return (
        <UiStack>
            <WalletGrid wallets={filtered} />
        </UiStack>
    );
}
