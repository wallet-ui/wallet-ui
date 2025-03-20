import { SolanaWalletUiButton, SolanaWalletUiDialog, useSolanaWalletUi } from '@wallet-ui/react';
import { TestReactPanel } from '@wallet-ui/test-react';

export default function UiPage() {
    const { connected, wallets, wallet, walletAccount } = useSolanaWalletUi();
    return (
        <div>
            <TestReactPanel />
            <SolanaWalletUiButton />
            <SolanaWalletUiDialog />
            <pre>
                {JSON.stringify(
                    {
                        connected,
                        wallet: wallet?.name ?? 'none',
                        walletAccount: walletAccount?.address ?? 'none',
                        wallets: wallets.map(wallet => wallet.name),
                    },
                    null,
                    4,
                )}
            </pre>
        </div>
    );
}
