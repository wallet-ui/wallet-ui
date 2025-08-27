import { createSolanaDevnet, createSolanaLocalnet, createSolanaTestnet } from '../clusters';

describe('createSolanaCluster', () => {
    it('should create a SolanaCluster for devnet', () => {
        // Act
        const result = createSolanaDevnet();
        // Assert
        expect(result).toMatchInlineSnapshot(`
            {
              "id": "solana:devnet",
              "label": "Devnet",
              "url": "devnet",
            }
        `);
    });
    it('should create a SolanaCluster for mainnet', () => {
        // Act
        const result = createSolanaDevnet();
        // Assert
        expect(result).toMatchInlineSnapshot(`
            {
              "id": "solana:devnet",
              "label": "Devnet",
              "url": "devnet",
            }
        `);
    });

    it('should create a SolanaCluster for localnet', () => {
        // Act
        const result = createSolanaLocalnet();
        // Assert
        expect(result).toMatchInlineSnapshot(`
            {
              "id": "solana:localnet",
              "label": "Localnet",
              "url": "localnet",
            }
        `);
    });

    it('should create a SolanaCluster for testnet', () => {
        // Act
        const result = createSolanaTestnet();
        // Assert
        expect(result).toMatchInlineSnapshot(`
            {
              "id": "solana:testnet",
              "label": "Testnet",
              "url": "testnet",
            }
        `);
    });
    it('should create a SolanaCluster with a custom url', () => {
        // Act
        const result = createSolanaLocalnet('http://host.docker.internal:8899');
        // Assert
        expect(result).toMatchInlineSnapshot(`
            {
              "id": "solana:localnet",
              "label": "Localnet",
              "url": "http://host.docker.internal:8899",
            }
        `);
    });
    it('should create a SolanaCluster with a custom label', () => {
        // Act
        const result = createSolanaLocalnet({
            label: 'Custom Local',
            url: 'http://host.docker.internal:8899',
        });
        // Assert
        expect(result).toMatchInlineSnapshot(`
            {
              "id": "solana:localnet",
              "label": "Custom Local",
              "url": "http://host.docker.internal:8899",
            }
        `);
    });
});
