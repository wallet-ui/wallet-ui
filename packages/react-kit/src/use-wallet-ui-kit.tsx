import { useContext } from 'react';

import { WalletUiKitContext } from './wallet-ui-kit-context';

export function useWalletUiKit() {
    return useContext(WalletUiKitContext);
}
