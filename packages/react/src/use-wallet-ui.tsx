import React from 'react';

import { WalletUiContext } from './wallet-ui-context';

export function useWalletUi() {
    return React.useContext(WalletUiContext);
}
