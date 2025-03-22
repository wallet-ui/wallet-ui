import { UiWallet, useConnect, useDisconnect } from '@wallet-standard/react';

export function useWalletUiWallet({ wallet }: { wallet: UiWallet }) {
    const [isConnecting, connect] = useConnect(wallet);
    const [isDisconnecting, disconnect] = useDisconnect(wallet);

    return {
        connect,
        disconnect,
        isConnecting,
        isDisconnecting,
    };
}
