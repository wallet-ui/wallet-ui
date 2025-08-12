import { useWalletAccountTransactionSendingSigner } from '@solana/react';
import { UiWalletAccount } from '@wallet-standard/react';

import { useWalletUi } from './use-wallet-ui';

export function useWalletUiSigner() {
    const { account, cluster } = useWalletUi();

    return useWalletAccountTransactionSendingSigner(account as UiWalletAccount, cluster.id);
}
