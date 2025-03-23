import { useContext } from 'react';

import { WalletUiSolanaClientContext } from './wallet-ui-solana-client-context';

export function useWalletUiSolanaClient() {
    return useContext(WalletUiSolanaClientContext);
}
