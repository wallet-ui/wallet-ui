import { useContext } from 'react';

import { MobileWalletAdapterProviderContext } from './mobile-wallet-adapter-provider';
import { useAuthorization } from './use-authorization';
import { useMobileWallet } from './use-mobile-wallet';

export function useMobileWalletAdapter() {
    const ctx = useContext(MobileWalletAdapterProviderContext);
    const { connect, connectAnd, signAndSendTransaction, signMessage, signIn } = useMobileWallet(ctx);
    const { selectedAccount, deauthorizeSessions } = useAuthorization(ctx);

    return {
        ...ctx,
        account: selectedAccount,
        connect,
        connectAnd,
        disconnect: deauthorizeSessions,
        signAndSendTransaction,
        signIn,
        signMessage,
    };
}
