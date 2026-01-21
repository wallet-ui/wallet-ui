# @wallet-ui/core

## 3.0.0

### Major Changes

- [#367](https://github.com/wallet-ui/wallet-ui/pull/367) [`0264164`](https://github.com/wallet-ui/wallet-ui/commit/0264164a9b131b636d22564300163b97b759ee31) Thanks [@beeman](https://github.com/beeman)! - Breaking changes to default cluster creation functions

    ### Breaking Change

    The behavior of the default cluster creation functions (`createSolanaDevnet`, `createSolanaMainnet`, etc.) has been changed. They now return full RPC URLs instead of symbolic names.

    **What changed (Breaking):**
    - Calling a creation function like `createSolanaDevnet()` with no arguments will now return a cluster with a full URL, e.g., `url: 'https://api.devnet.solana.com'`. Previously, it returned a symbolic name, e.g., `url: 'devnet'`. This is a breaking change for anyone who was relying on the symbolic names.

    **What changed (Non-Breaking):**
    - To support more flexible RPC configurations, the `SolanaCluster` interface now has an optional `urlWs` property for a dedicated WebSocket endpoint.
    - The creation functions have been updated to accept a `urlWs` property.
    - `createSolanaLocalnet` will now automatically infer a WebSocket URL (e.g., `ws://localhost:8900`) if a standard HTTP URL is provided (e.g., `http://localhost:8899`).

    **Why this change was made:**
    To improve the developer experience with better defaults and to provide more flexibility by allowing separate RPC and WebSocket URLs.

    **How to update your code:**
    - If your code checks for symbolic cluster names (e.g., `if (cluster.url === 'devnet')`), you must update it to handle full RPC URLs.
    - If you have a custom WebSocket endpoint, you can now provide it via the `urlWs` property when creating a `SolanaCluster`.

## 2.2.2

## 2.2.1

## 2.2.0

## 2.1.0

### Minor Changes

- [#321](https://github.com/wallet-ui/wallet-ui/pull/321) [`a9eb7e2`](https://github.com/wallet-ui/wallet-ui/commit/a9eb7e21790b4bf7c30317e49234d39e611cd615) Thanks [@beeman](https://github.com/beeman)! - update @solana/kit and gill versions

## 2.0.0

### Major Changes

- [#262](https://github.com/wallet-ui/wallet-ui/pull/262) [`1051671`](https://github.com/wallet-ui/wallet-ui/commit/1051671506a6d1644cb23e0d5e1fcb0b05f3c03c) Thanks [@beeman](https://github.com/beeman)! - clean up SolanaCluster type

- [#246](https://github.com/wallet-ui/wallet-ui/pull/246) [`b94b01b`](https://github.com/wallet-ui/wallet-ui/commit/b94b01b27c52ca9f887c54951e4c67075498075f) Thanks [@beeman](https://github.com/beeman)! - rename useWalletUiTransactionSignAndSend -> useWalletUiSignAndSend

- [#261](https://github.com/wallet-ui/wallet-ui/pull/261) [`04f65bb`](https://github.com/wallet-ui/wallet-ui/commit/04f65bbb35f82d5d21c4332bc72363e4bfd9da87) Thanks [@beeman](https://github.com/beeman)! - move gill client into @wallet-ui/react-gill package

### Patch Changes

- [#286](https://github.com/wallet-ui/wallet-ui/pull/286) [`d25ee0c`](https://github.com/wallet-ui/wallet-ui/commit/d25ee0cc6de5e0456bb49ed3d026c59563b9b1ef) Thanks [@beeman](https://github.com/beeman)! - update dependencies

## 1.1.1

### Patch Changes

- [#242](https://github.com/wallet-ui/wallet-ui/pull/242) [`c89fb4d`](https://github.com/wallet-ui/wallet-ui/commit/c89fb4d5f4836871c365fbe7bd009bd0d692f202) Thanks [@beeman](https://github.com/beeman)! - add homepage to package.json

## 1.1.0

### Minor Changes

- [#59](https://github.com/wallet-ui/wallet-ui/pull/59) [`c6c9581`](https://github.com/wallet-ui/wallet-ui/commit/c6c9581bc2700dca1758e46fb2ca835627aa830d) Thanks [@beeman](https://github.com/beeman)! - update gill version to 0.5.0

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

- [#60](https://github.com/wallet-ui/wallet-ui/pull/60) [`7a78374`](https://github.com/wallet-ui/wallet-ui/commit/7a78374c04e1e5b51e3e7adb3dc2b640d5a334cf) Thanks [@beeman](https://github.com/beeman)! - re-export "@wallet-standard/react" in "@wallet-ui/react"

### Patch Changes

- [#80](https://github.com/wallet-ui/wallet-ui/pull/80) [`cdb50b1`](https://github.com/wallet-ui/wallet-ui/commit/cdb50b1bb7a91f81e23a7df9f52cafa040b00618) Thanks [@beeman](https://github.com/beeman)! - refactor: create-solana-cluster functions"

- [#201](https://github.com/wallet-ui/wallet-ui/pull/201) [`b98d03f`](https://github.com/wallet-ui/wallet-ui/commit/b98d03f6cfe4a242a5b7c5d813e8541b28469755) Thanks [@beeman](https://github.com/beeman)! - update gill version to 0.10.2

- [#68](https://github.com/wallet-ui/wallet-ui/pull/68) [`ac85741`](https://github.com/wallet-ui/wallet-ui/commit/ac8574146f516a0184dcb8a83228e1b0cd1228cf) Thanks [@beeman](https://github.com/beeman)! - update gill to 0.7.0

- [#79](https://github.com/wallet-ui/wallet-ui/pull/79) [`0498ae1`](https://github.com/wallet-ui/wallet-ui/commit/0498ae161983058b0ec7bbc60e55deebed5a6db3) Thanks [@beeman](https://github.com/beeman)! - feat: add handleCopyText function

- [#80](https://github.com/wallet-ui/wallet-ui/pull/80) [`d8f1143`](https://github.com/wallet-ui/wallet-ui/commit/d8f1143d539fca3eb15706216a5e11668ef5a6b3) Thanks [@beeman](https://github.com/beeman)! - feat: implement @wallet-ui/playground-react package

- [#82](https://github.com/wallet-ui/wallet-ui/pull/82) [`f523b5a`](https://github.com/wallet-ui/wallet-ui/commit/f523b5a76808329eb0945008254de7f4a3f691e0) Thanks [@beeman](https://github.com/beeman)! - refactor: make gill a peer dependency

- [#97](https://github.com/wallet-ui/wallet-ui/pull/97) [`032f142`](https://github.com/wallet-ui/wallet-ui/commit/032f1422e6e6214c1d1825a0233975a9c6cee397) Thanks [@beeman](https://github.com/beeman)! - feat: use nanostores for storing selected account and cluster

## 1.0.0

### Major Changes

- [#6](https://github.com/wallet-ui/wallet-ui/pull/6) [`e46ae0c`](https://github.com/wallet-ui/wallet-ui/commit/e46ae0cc18f5be5467548d4e13ab3fc5fc65a1f4) Thanks [@beeman](https://github.com/beeman)! - initial commit
