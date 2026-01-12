import { createSolanaDevnet, createSolanaLocalnet, createSolanaMainnet, createSolanaTestnet } from '../clusters';
import { SolanaCluster } from '../types/solana-cluster';

// [DESCRIBE] createSolanaCluster
{
    {
        const result: SolanaCluster = createSolanaDevnet();
        result satisfies SolanaCluster;
    }
    {
        const result: SolanaCluster = createSolanaDevnet({
            http: 'https://api.devnet.solana.com',
            label: 'Custom Devnet',
        });
        result satisfies SolanaCluster;
    }
    {
        const result: SolanaCluster = createSolanaDevnet('devnet');
        result satisfies SolanaCluster;
    }
    {
        const result: SolanaCluster = createSolanaLocalnet();
        result satisfies SolanaCluster;
    }
    {
        const result: SolanaCluster = createSolanaLocalnet({
            http: 'http://host.docker.internal:8899',
            label: 'Custom Local',
        });
        result satisfies SolanaCluster;
    }
    {
        const result: SolanaCluster = createSolanaLocalnet('http://host.docker.internal:8899');
        result satisfies SolanaCluster;
    }
    {
        const result: SolanaCluster = createSolanaTestnet();
        result satisfies SolanaCluster;
    }
    {
        const result: SolanaCluster = createSolanaTestnet({
            http: 'https://api.testnet.solana.com',
            label: 'Custom Testnet',
        });
        result satisfies SolanaCluster;
    }
    {
        const result: SolanaCluster = createSolanaTestnet('testnet');
        result satisfies SolanaCluster;
    }
    {
        const result: SolanaCluster = createSolanaMainnet('https://api.mainnet-beta.solana.com');
        result satisfies SolanaCluster;
    }
    {
        const result: SolanaCluster = createSolanaMainnet('https://api.mainnet-beta.solana.com');
        result satisfies SolanaCluster;
    }
    {
        const result: SolanaCluster = createSolanaMainnet({
            http: 'https://api.mainnet-beta.solana.com',
            label: 'Custom Mainnet',
        });
        result satisfies SolanaCluster;
    }
}
