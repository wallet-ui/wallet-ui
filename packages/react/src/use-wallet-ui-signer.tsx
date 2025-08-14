import { useWalletAccountTransactionSendingSigner } from '@solana/react';
import { UiWalletAccount } from '@wallet-standard/react';

import { useWalletUi } from './use-wallet-ui';

export function useWalletUiSigner({ account }: { account: UiWalletAccount }) {
    const { cluster } = useWalletUi();

    return useWalletAccountTransactionSendingSigner(account, cluster.id);
}
