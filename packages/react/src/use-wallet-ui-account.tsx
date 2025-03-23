import { useContext } from 'react';

import { WalletUiAccountContext } from './wallet-ui-account-context';

export function useWalletUiAccount() {
    return useContext(WalletUiAccountContext);
}
