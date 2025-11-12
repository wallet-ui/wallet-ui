import { clusterApiUrl } from '@solana/web3.js';
import { Network, NetworkCluster } from '@/features/network/network';

export class AppConfig {
    static name = 'web3js-expo';
    static uri = 'https://example.com';
    static networks: Network[] = [
        {
            cluster: NetworkCluster.Devnet,
            endpoint: clusterApiUrl('devnet'),
            id: 'solana:devnet',
            name: 'Devnet',
        },
        {
            cluster: NetworkCluster.Testnet,
            endpoint: clusterApiUrl('testnet'),
            id: 'solana:testnet',
            name: 'Testnet',
        },
    ];
}
