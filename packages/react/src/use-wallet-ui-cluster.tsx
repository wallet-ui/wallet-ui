import { useContext } from 'react';

import { WalletUiClusterContext } from './wallet-ui-cluster-context';

export function useWalletUiCluster() {
    return useContext(WalletUiClusterContext);
}
