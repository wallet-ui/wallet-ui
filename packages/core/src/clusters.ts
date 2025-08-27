import type {
    SolanaCluster,
    SolanaDevnetUrl,
    SolanaLocalnetUrl,
    SolanaMainnetUrl,
    SolanaTestnetUrl,
} from './types/solana-cluster';

export type CreateSolanaProps = Partial<Pick<SolanaCluster, 'label' | 'url'>> | string;

function createSolanaCluster<T extends SolanaDevnetUrl | SolanaLocalnetUrl | SolanaMainnetUrl | SolanaTestnetUrl>(
    props: CreateSolanaProps,
    { id, label, url }: SolanaCluster,
): Pick<SolanaCluster, 'id' | 'label' | 'url'> {
    if (typeof props === 'string') {
        return { id, label, url: props as T };
    }

    return { id, label: props.label ?? label, url: props.url ?? url };
}

export function createSolanaDevnet(props: CreateSolanaProps = {}): SolanaCluster {
    return createSolanaCluster<SolanaDevnetUrl>(props, {
        id: 'solana:devnet',
        label: 'Devnet',
        url: 'devnet' as SolanaDevnetUrl,
    });
}

export function createSolanaLocalnet(props: CreateSolanaProps = {}): SolanaCluster {
    return createSolanaCluster(props, {
        id: 'solana:localnet',
        label: 'Localnet',
        url: 'localnet' as SolanaLocalnetUrl,
    });
}

export function createSolanaMainnet(props: CreateSolanaProps = {}): SolanaCluster {
    return createSolanaCluster(props, {
        id: 'solana:mainnet',
        label: 'Mainnet',
        url: 'mainnet' as SolanaMainnetUrl,
    });
}

export function createSolanaTestnet(props: CreateSolanaProps = {}): SolanaCluster {
    return createSolanaCluster(props, {
        id: 'solana:testnet',
        label: 'Testnet',
        url: 'testnet' as SolanaTestnetUrl,
    });
}
