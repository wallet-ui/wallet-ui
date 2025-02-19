import { createSolanaClient, ModifiedClusterUrl, SolanaClusterMoniker } from 'gill';

export type SolanaClient = ReturnType<typeof createSolanaClient>;
export type SolanaClientUrlOrMoniker = ModifiedClusterUrl | SolanaClusterMoniker | URL;
