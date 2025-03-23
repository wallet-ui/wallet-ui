import { useWallets } from '@wallet-standard/react';
import { useMemo } from 'react';

export function useWalletUiWallets() {
    const readonlyWallets = useWallets();
    return useMemo(
        () =>
            readonlyWallets
                .filter(wallet => wallet.chains.some(i => i.startsWith('solana:')))
                .sort((a, b) => a.name.localeCompare(b.name)),
        [readonlyWallets],
    );
}
