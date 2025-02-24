import { createSolanaClient } from 'gill';
import { ModifiedClusterUrl, SolanaClusterMoniker } from 'gill/dist/types/rpc';

export type SolanaClient = ReturnType<typeof createSolanaClient>;
export type SolanaClientUrlOrMoniker = ModifiedClusterUrl | SolanaClusterMoniker | URL;
export type SolanaClientCluster = SolanaClusterMoniker | 'mainnet-beta';
