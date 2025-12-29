import { SolanaClusterId } from './types/solana-cluster-id';

export type ExplorerPath = `/address/${string}` | `/block/${string}` | `/tx/${string}`;
export type ExplorerProvider = 'orb' | 'solana' | 'solscan';
export const explorerProviders: ExplorerProvider[] = ['solana', 'solscan', 'orb'] as const;

export interface GetNetworkSuffixProps {
    id: SolanaClusterId;
    url: string;
}

export interface GetExplorerUrlProps {
    network: GetNetworkSuffixProps;
    path: ExplorerPath;
    provider: ExplorerProvider;
}

export function getExplorerUrl({ network, path, provider }: GetExplorerUrlProps) {
    if (!(path.startsWith('/address') || path.startsWith('/block') || path.startsWith('/tx'))) {
        throw new Error('Invalid path. Must be /address/{address}, /block/{id}, or /tx/{signature}.');
    }
    if (!explorerProviders.includes(provider)) {
        throw new Error(`Invalid provider. Must be one of ${explorerProviders.join(', ')}.`);
    }
    const url = new URL(getExplorerBaseUrl(provider));
    url.pathname = path;
    const params = getExplorerSuffix(network);
    if (params.cluster.length) {
        url.searchParams.set('cluster', params.cluster);
    }
    if (params.customUrl.length) {
        url.searchParams.set('customUrl', params.customUrl);
    }
    return url.toString();
}

function getExplorerBaseUrl(provider: ExplorerProvider) {
    switch (provider) {
        case 'orb':
            return 'https://orbmarkets.io';
        case 'solscan':
            return 'https://solscan.io';
        default:
            return 'https://explorer.solana.com';
    }
}

function getExplorerSuffix(props: GetNetworkSuffixProps): {
    cluster: string;
    customUrl: string;
} {
    switch (props.id) {
        case 'solana:devnet':
            return { cluster: 'devnet', customUrl: '' };
        case 'solana:localnet':
            return { cluster: 'custom', customUrl: props.url };
        case 'solana:testnet':
            return { cluster: 'testnet', customUrl: '' };
        default:
            return { cluster: '', customUrl: '' };
    }
}
