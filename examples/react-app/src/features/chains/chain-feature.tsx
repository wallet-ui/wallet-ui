import { useSolanaChain } from '@wallet-ui/react';

export default function ChainFeature() {
    const { chain, chains, setChain } = useSolanaChain();
    if (!setChain) {
        return null;
    }
    return (
        <div>
            <div style={styles.grid}>
                {chains.map(item => {
                    const activeChain = item.id === chain.id;
                    return (
                        <div
                            key={item.id}
                            style={{
                                ...styles.card,
                                ...(activeChain ? styles.activeCard : {}),
                            }}
                            onClick={() => setChain(item.id)}
                        >
                            <h3 style={styles.cardTitle}>{item.label}</h3>
                            <p style={styles.cardText}>RPC URL: {item.rpcUrl}</p>
                            <p style={styles.cardText}>Subscriptions: {item.rpcSubscriptionsUrl}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const styles = {
    activeCard: {
        border: '2px solid #9945FF',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transform: 'scale(1.01)',
    },
    card: {
        border: '1px solid #ccc',
        borderRadius: '8px',
        cursor: 'pointer',
        padding: '16px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    cardText: {
        color: '#555',
        fontSize: '14px',
        margin: '4px 0',
    },
    cardTitle: {
        color: '#333',
        fontSize: '18px',
        margin: '0 0 8px',
    },
    grid: {
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        padding: '16px',
    },
};
