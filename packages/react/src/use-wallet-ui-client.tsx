import { useContext } from 'react';

import { WalletUiClientContext } from './wallet-ui-client-context';

export function useWalletUiClient() {
    return useContext(WalletUiClientContext);
}
