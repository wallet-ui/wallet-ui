# @wallet-ui/react

## 1.1.0

### Minor Changes

- [#39](https://github.com/wallet-ui/wallet-ui/pull/39) [`d259001`](https://github.com/wallet-ui/wallet-ui/commit/d259001d8775f6290767a014c2e086b97b790747) Thanks [@beeman](https://github.com/beeman)! - migrate the code to use gill instead of @solana/web3.js@2

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

### Patch Changes

- Updated dependencies [[`d259001`](https://github.com/wallet-ui/wallet-ui/commit/d259001d8775f6290767a014c2e086b97b790747)]:
    - @wallet-ui/core@1.1.0

## 1.0.0

### Major Changes

- [#6](https://github.com/wallet-ui/wallet-ui/pull/6) [`e46ae0c`](https://github.com/wallet-ui/wallet-ui/commit/e46ae0cc18f5be5467548d4e13ab3fc5fc65a1f4) Thanks [@beeman](https://github.com/beeman)! - initial commit

### Patch Changes

- Updated dependencies [[`e46ae0c`](https://github.com/wallet-ui/wallet-ui/commit/e46ae0cc18f5be5467548d4e13ab3fc5fc65a1f4)]:
    - @wallet-ui/core@1.0.0
