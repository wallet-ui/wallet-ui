import { useWalletUiCluster } from '@wallet-ui/react';

export default function ClusterFeature() {
    const { cluster, clusters, setCluster } = useWalletUiCluster();
    return (
        <div>
            <div style={styles.grid}>
                {clusters.map(item => {
                    const activeCluster = item.id === cluster.id;
                    return (
                        <div
                            key={item.id}
                            style={{
                                ...styles.card,
                                ...(activeCluster ? styles.activeCard : {}),
                            }}
                            onClick={() => setCluster(item.id)}
                        >
                            <h3 style={styles.cardTitle}>{item.label}</h3>
                            <p style={styles.cardText}>RPC URL: {`${item.urlOrMoniker}`}</p>
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
