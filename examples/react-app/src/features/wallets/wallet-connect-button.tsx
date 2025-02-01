import { UiWallet, useConnect, useDisconnect } from '@wallet-standard/react';
import { useSolanaWallet } from '@wallet-ui/react';

export function WalletConnectButton({ wallets }: { wallets: UiWallet[] }) {
    const [_selectedWalletAccount, setSelectedWalletAccount] = useSolanaWallet();
    const popoverId = "wallet-popover";
    
    const connectedWallet = wallets.find(wallet => wallet.accounts.length > 0);
    
    return (
        <div className="wallet-connect-container">
            {connectedWallet ? (
                <DisconnectButton 
                    wallet={connectedWallet} 
                    onDisconnect={() => setSelectedWalletAccount(undefined)} 
                />
            ) : (
                <button 
                    popoverTarget={popoverId}
                    className="connect-button"
                >
                    Connect Wallet
                </button>
            )}

            <div 
                id={popoverId}
                popover="auto"
                className="wallet-popover"
            >
                <div className="popover-header">
                    <h3>Select Wallet</h3>
                    <button 
                        className="close-button"
                        popoverTarget={popoverId}
                        popoverTargetAction="hide"
                    >
                        &times;
                    </button>
                </div>
                
                <div className="wallet-list">
                    {wallets?.map((wallet) => (
                        <WalletConnectItem 
                            key={wallet.name}
                            wallet={wallet}
                            popoverId={popoverId}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function DisconnectButton({ onDisconnect, wallet }: { onDisconnect: () => void, wallet: UiWallet }) {
    const [isDisconnecting, disconnect] = useDisconnect(wallet);
    
    return (
        <button 
            className="connect-button"
            disabled={isDisconnecting}
            onClick={async () => {
                await disconnect();
                onDisconnect();
            }}
        >
            Disconnect {wallet.name}
        </button>
    );
}

function WalletConnectItem({ wallet, popoverId }: { popoverId: string, wallet: UiWallet }) {
    const [isConnecting, connect] = useConnect(wallet);
    const [isDisconnecting, disconnect] = useDisconnect(wallet);
    const isPending = isConnecting || isDisconnecting;
    const isConnected = wallet.accounts.length > 0;

    const handleAction = () => {
        const action = isConnected ? disconnect : connect;
        action().catch(console.error);
        document.getElementById(popoverId)?.hidePopover();
    };

    return (
        <button
            className="wallet-item"
            disabled={isPending}
            onClick={handleAction}
        >
            <img 
                src={wallet.icon} 
                alt={wallet.name}
                className="wallet-icon"
            />
            <div className="wallet-info">
                <span className="wallet-name">{wallet.name}</span>
                <span className="wallet-features">
                    {wallet.features?.join(', ')}
                </span>
            </div>
            {isPending && <span className="connecting-indicator">Connecting...</span>}
            {isConnected && <span className="connected-indicator">✓</span>}
        </button>
        
    );
}
