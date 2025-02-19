---
'@wallet-ui/react': minor
'@wallet-ui/core': minor
---

migrate the code to use gill instead of @solana/web3.js@2

## Minor Changes

- @wallet-ui/core
    - rename 'chain' to 'cluster'
    - export `SolanaClient`, `SolanaClientUrlOrMoniker` based on types from gill
- @wallet-ui/react
    - rename 'chain' to 'cluster' (eg, `SolanaChainProvider` -> `SolanaClusterProvider`)
    - rename 'solana-rpc' to 'solana-client' (eg, `SolanaRpcProvider` -> `SolanaClientProvider`)
    - the `useSolanaClient` hook now returns what createSolanaClient from gill returns
    - `SolanaClientProvider` no longer depends on `SolanaClusterProvider` but now takes an `urlOrMoniker`, for people
      who want to manage their own clusters
    - this package now re-exports everything from @wallet-ui/core to simplify usage
