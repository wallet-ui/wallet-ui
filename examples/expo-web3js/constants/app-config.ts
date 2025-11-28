import { clusterApiUrl } from '@solana/web3.js';
import { AppIdentity, createSolanaDevnet, createSolanaTestnet, SolanaCluster } from '@wallet-ui/react-native-web3js';

export class AppConfig {
    static identity: AppIdentity = {
        name: 'web3js-expo',
        uri: 'https://example.com',
    };
    static networks: SolanaCluster[] = [
        createSolanaDevnet({ url: clusterApiUrl('devnet') }),
        createSolanaTestnet({ url: clusterApiUrl('testnet') }),
    ];
}
