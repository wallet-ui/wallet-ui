import { createSolanaDevnet, createSolanaLocalnet, createSolanaTestnet } from '../clusters';

describe('createSolanaCluster', () => {
    it('should create a SolanaCluster for devnet', () => {
        // Act
        const result = createSolanaDevnet();
        // Assert
        expect(result).toMatchInlineSnapshot(`
            {
              "cluster": "devnet",
              "id": "solana:devnet",
              "label": "Devnet",
              "urlOrMoniker": "devnet",
            }
        `);
    });
    it('should create a SolanaCluster for mainnet', () => {
        // Act
        const result = createSolanaDevnet();
        // Assert
        expect(result).toMatchInlineSnapshot(`
            {
              "cluster": "devnet",
              "id": "solana:devnet",
              "label": "Devnet",
              "urlOrMoniker": "devnet",
            }
        `);
    });

    it('should create a SolanaCluster for localnet', () => {
        // Act
        const result = createSolanaLocalnet();
        // Assert
        expect(result).toMatchInlineSnapshot(`
            {
              "cluster": "localnet",
              "id": "solana:local",
              "label": "Localnet",
              "urlOrMoniker": "localnet",
            }
        `);
    });

    it('should create a SolanaCluster for testnet', () => {
        // Act
        const result = createSolanaTestnet();
        // Assert
        expect(result).toMatchInlineSnapshot(`
            {
              "cluster": "testnet",
              "id": "solana:testnet",
              "label": "Testnet",
              "urlOrMoniker": "testnet",
            }
        `);
    });
    it('should create a SolanaCluster with a custom url', () => {
        // Act
        const result = createSolanaLocalnet('http://host.docker.internal:8899');
        // Assert
        expect(result).toMatchInlineSnapshot(`
            {
              "cluster": "localnet",
              "id": "solana:local",
              "label": "Localnet",
              "urlOrMoniker": "http://host.docker.internal:8899",
            }
        `);
    });
    it('should create a SolanaCluster with a custom label', () => {
        // Act
        const result = createSolanaLocalnet({
            label: 'Custom Local',
            urlOrMoniker: 'http://host.docker.internal:8899',
        });
        // Assert
        expect(result).toMatchInlineSnapshot(`
            {
              "cluster": "localnet",
              "id": "solana:local",
              "label": "Custom Local",
              "urlOrMoniker": "http://host.docker.internal:8899",
            }
        `);
    });
});
