import type { TransactionSendingSigner } from '@solana/kit';
import { useWalletAccountTransactionSendingSigner } from '@solana/react';
import type { UiWalletAccount } from '@wallet-standard/react';

import { useWalletUi } from './use-wallet-ui';

export function useWalletUiSigner({
    account,
}: {
    account: UiWalletAccount;
}): TransactionSendingSigner<UiWalletAccount['address']> {
    const { cluster } = useWalletUi();

    return useWalletAccountTransactionSendingSigner(account, cluster.id);
}
