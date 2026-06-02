import {
    createSolanaDevnet,
    createSolanaLocalnet,
    createSolanaTestnet,
    createWalletUiConfig,
    WalletUi,
    WalletUiClusterDropdown,
    WalletUiDropdown,
} from '@wallet-ui/react';

const walletUiConfig = createWalletUiConfig({
    clusters: [createSolanaDevnet(), createSolanaLocalnet(), createSolanaTestnet()],
});

export default function WalletUiDropdownDemo() {
    return (
        <div className="wallet-ui-react-island">
            <WalletUi config={walletUiConfig}>
                <div className="wallet-ui-react-island__controls">
                    <div className="wallet-ui-react-island__control">
                        <p className="wallet-ui-react-island__label">Cluster</p>
                        <WalletUiClusterDropdown showIndicator />
                    </div>
                    <div className="wallet-ui-react-island__control">
                        <p className="wallet-ui-react-island__label">Wallet</p>
                        <WalletUiDropdown />
                    </div>
                </div>
            </WalletUi>
        </div>
    );
}
