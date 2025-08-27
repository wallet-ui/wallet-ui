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
            label: 'Custom Devnet',
            url: 'https://api.devnet.solana.com',
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
            label: 'Custom Local',
            url: 'http://host.docker.internal:8899',
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
        const result: SolanaCluster = createSolanaTestnet({ label: 'Custom Testnet' });
        result satisfies SolanaCluster;
    }
    {
        const result: SolanaCluster = createSolanaTestnet('testnet');
        result satisfies SolanaCluster;
    }
    {
        const result: SolanaCluster = createSolanaMainnet();
        result satisfies SolanaCluster;
    }
    {
        const result: SolanaCluster = createSolanaMainnet('https://api.mainnet-beta.solana.com');
        result satisfies SolanaCluster;
    }
    {
        const result: SolanaCluster = createSolanaMainnet({
            label: 'Custom Mainnet',
            url: 'https://api.mainnet-beta.solana.com',
        });
        result satisfies SolanaCluster;
    }
}
