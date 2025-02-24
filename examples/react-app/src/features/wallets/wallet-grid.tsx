import { UiWallet, useConnect, useDisconnect } from '@wallet-standard/react';
import { useSolanaWallet } from '@wallet-ui/react';

export function WalletGrid({ wallets }: { wallets: UiWallet[] }) {
    return (
        <div style={styles.grid}>
            {wallets?.map((wallet, index) => {
                if (!wallet) {
                    return null;
                }
                return <WalletGridItem key={index} wallet={wallet} />;
            })}
        </div>
    );
}

export function WalletGridItem({ wallet }: { wallet: UiWallet }) {
    const [isConnecting, connect] = useConnect(wallet);
    const [isDisconnecting, disconnect] = useDisconnect(wallet);
    const [selectedWalletAccount, setSelectedWalletAccount] = useSolanaWallet();
    const isPending = isConnecting || isDisconnecting;
    const isConnected = wallet.accounts.length > 0;

    return (
        <div style={styles.card}>
            <img src={wallet.icon} alt={wallet.name} style={styles.icon} />
            <h3 style={styles.cardTitle}>{wallet.name}</h3>

            {isConnected ? (
                <div>
                    <button disabled={isPending} onClick={() => disconnect()}>
                        Disconnect
                    </button>
                </div>
            ) : (
                <div>
                    <button disabled={isPending} onClick={() => connect()}>
                        Connect
                    </button>
                </div>
            )}

            <p style={styles.cardText}>
                Features: <br />
                {wallet?.features?.join(', ')}
            </p>
            <p style={styles.cardText}>
                Clusters: <br />
                {wallet.chains.join(', ')}
            </p>
            <div>
                {wallet?.accounts?.length
                    ? wallet?.accounts?.map(acc => {
                          return (
                              <div key={acc.address}>
                                  <p>{acc.address}</p>
                                  <button
                                      disabled={acc?.address === selectedWalletAccount?.address}
                                      onClick={() => setSelectedWalletAccount(acc)}
                                  >
                                      Select
                                  </button>
                              </div>
                          );
                      })
                    : null}
            </div>
        </div>
    );
}

const styles = {
    card: {
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        padding: '16px',
        textAlign: 'center',
    },
    cardText: {
        fontSize: '14px',
        lineHeight: '1.5',
        margin: '4px 0',
    },
    cardTitle: {
        fontSize: '18px',
        margin: '0 0 8px',
    },
    grid: {
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        padding: '16px',
    },
    icon: {
        borderRadius: '50%',
        height: '48px',
        marginBottom: '8px',
        width: '48px',
    },
};
