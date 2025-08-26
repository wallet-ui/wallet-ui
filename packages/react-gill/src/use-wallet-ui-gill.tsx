import { useContext } from 'react';

import { WalletUiGillContext } from './wallet-ui-gill-context';

export function useWalletUiGill() {
    return useContext(WalletUiGillContext);
}
