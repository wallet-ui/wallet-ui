import { useContext } from 'react';

import { SolanaMobileProviderContext } from './solana-mobile-provider';
import { useAuthorization } from './use-authorization';
import { useMobileWallet } from './use-mobile-wallet';

export function useSolanaMobile() {
    const ctx = useContext(SolanaMobileProviderContext);
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
