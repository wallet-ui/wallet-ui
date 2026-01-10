import { createSolanaDevnet, createSolanaLocalnet, createSolanaTestnet } from '../clusters';

describe('createSolanaCluster', () => {
    it('should create a SolanaCluster for devnet', () => {
        // Act
        const result = createSolanaDevnet();
        // Assert
        expect(result).toMatchInlineSnapshot(`
            {
              "http": "https://api.devnet.solana.com",
              "id": "solana:devnet",
              "label": "Devnet",
              "url": "https://api.devnet.solana.com",
            }
        `);
    });
    it('should create a SolanaCluster for mainnet', () => {
        // Act
        const result = createSolanaDevnet();
        // Assert
        expect(result).toMatchInlineSnapshot(`
            {
              "http": "https://api.devnet.solana.com",
              "id": "solana:devnet",
              "label": "Devnet",
              "url": "https://api.devnet.solana.com",
            }
        `);
    });

    it('should create a SolanaCluster for localnet', () => {
        // Act
        const result = createSolanaLocalnet();
        // Assert
        expect(result).toMatchInlineSnapshot(`
            {
              "http": "http://localhost:8899",
              "id": "solana:localnet",
              "label": "Localnet",
              "url": "http://localhost:8899",
            }
        `);
    });

    it('should create a SolanaCluster for testnet', () => {
        // Act
        const result = createSolanaTestnet();
        // Assert
        expect(result).toMatchInlineSnapshot(`
            {
              "http": "https://api.testnet.solana.com",
              "id": "solana:testnet",
              "label": "Testnet",
              "url": "https://api.testnet.solana.com",
            }
        `);
    });
    it('should create a SolanaCluster with a custom url', () => {
        // Act
        const result = createSolanaLocalnet('http://host.docker.internal:8899');
        // Assert
        expect(result).toMatchInlineSnapshot(`
            {
              "http": "http://host.docker.internal:8899",
              "id": "solana:localnet",
              "label": "Localnet",
              "url": "http://host.docker.internal:8899",
            }
        `);
    });
    it('should create a SolanaCluster with a custom label', () => {
        // Act
        const result = createSolanaLocalnet({
            http: 'http://host.docker.internal:8899',
            label: 'Custom Local',
        });
        // Assert
        expect(result).toMatchInlineSnapshot(`
            {
              "http": "http://host.docker.internal:8899",
              "id": "solana:localnet",
              "label": "Custom Local",
              "url": "http://host.docker.internal:8899",
              "ws": "ws://localhost:8900",
            }
        `);
    });
});
