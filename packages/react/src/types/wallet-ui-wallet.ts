import { UiWallet } from '@wallet-standard/react';

import { WalletUiWalletAccount } from './wallet-ui-wallet-account';

export type WalletUiWallet = Pick<UiWallet, 'chains' | 'features' | 'icon' | 'name'> & {
    accounts: WalletUiWalletAccount[];
};
