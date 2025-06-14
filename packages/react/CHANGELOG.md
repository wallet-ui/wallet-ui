# @wallet-ui/react

## 1.1.0

### Minor Changes

- [#185](https://github.com/wallet-ui/wallet-ui/pull/185) [`e5f1812`](https://github.com/wallet-ui/wallet-ui/commit/e5f181250b2466f1b37d401760aa3f2a49f91284) Thanks [@beeman](https://github.com/beeman)! - refactor: rename wallet ui css variables and identifiers

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

- [#85](https://github.com/wallet-ui/wallet-ui/pull/85) [`9ed41c8`](https://github.com/wallet-ui/wallet-ui/commit/9ed41c8cfc7798926e77c430aab7ac5ac124a36f) Thanks [@beeman](https://github.com/beeman)! - feat: export accountKeys from wallet-ui-context

- [#80](https://github.com/wallet-ui/wallet-ui/pull/80) [`4ca5cca`](https://github.com/wallet-ui/wallet-ui/commit/4ca5cca2538341fc98eb79f0df9af1ca4a014bc8) Thanks [@beeman](https://github.com/beeman)! - feat: implement @wallet-ui/react components"

- [#68](https://github.com/wallet-ui/wallet-ui/pull/68) [`ac85741`](https://github.com/wallet-ui/wallet-ui/commit/ac8574146f516a0184dcb8a83228e1b0cd1228cf) Thanks [@beeman](https://github.com/beeman)! - update gill to 0.7.0

- [#142](https://github.com/wallet-ui/wallet-ui/pull/142) [`1793450`](https://github.com/wallet-ui/wallet-ui/commit/1793450839f4723ffeb55a74f6fd757dc01bb658) Thanks [@beeman](https://github.com/beeman)! - fix cluster not found error

- [#81](https://github.com/wallet-ui/wallet-ui/pull/81) [`aa62988`](https://github.com/wallet-ui/wallet-ui/commit/aa629887506fdaf6a6ab49f0f483052733c2e7f1) Thanks [@beeman](https://github.com/beeman)! - fix: @wallet-ui/react exports

- [#80](https://github.com/wallet-ui/wallet-ui/pull/80) [`d8f1143`](https://github.com/wallet-ui/wallet-ui/commit/d8f1143d539fca3eb15706216a5e11668ef5a6b3) Thanks [@beeman](https://github.com/beeman)! - feat: implement @wallet-ui/playground-react package

- [#82](https://github.com/wallet-ui/wallet-ui/pull/82) [`f523b5a`](https://github.com/wallet-ui/wallet-ui/commit/f523b5a76808329eb0945008254de7f4a3f691e0) Thanks [@beeman](https://github.com/beeman)! - refactor: make gill a peer dependency

- [#191](https://github.com/wallet-ui/wallet-ui/pull/191) [`eb0d9d8`](https://github.com/wallet-ui/wallet-ui/commit/eb0d9d845c9cb8173896aa4937dce45735fb3750) Thanks [@beeman](https://github.com/beeman)! - expose selected cluster through useWalletUi hook

- [#97](https://github.com/wallet-ui/wallet-ui/pull/97) [`032f142`](https://github.com/wallet-ui/wallet-ui/commit/032f1422e6e6214c1d1825a0233975a9c6cee397) Thanks [@beeman](https://github.com/beeman)! - feat: use nanostores for storing selected account and cluster

- Updated dependencies [[`cdb50b1`](https://github.com/wallet-ui/wallet-ui/commit/cdb50b1bb7a91f81e23a7df9f52cafa040b00618), [`ac85741`](https://github.com/wallet-ui/wallet-ui/commit/ac8574146f516a0184dcb8a83228e1b0cd1228cf), [`0498ae1`](https://github.com/wallet-ui/wallet-ui/commit/0498ae161983058b0ec7bbc60e55deebed5a6db3), [`c6c9581`](https://github.com/wallet-ui/wallet-ui/commit/c6c9581bc2700dca1758e46fb2ca835627aa830d), [`d8f1143`](https://github.com/wallet-ui/wallet-ui/commit/d8f1143d539fca3eb15706216a5e11668ef5a6b3), [`f523b5a`](https://github.com/wallet-ui/wallet-ui/commit/f523b5a76808329eb0945008254de7f4a3f691e0), [`d259001`](https://github.com/wallet-ui/wallet-ui/commit/d259001d8775f6290767a014c2e086b97b790747), [`032f142`](https://github.com/wallet-ui/wallet-ui/commit/032f1422e6e6214c1d1825a0233975a9c6cee397), [`7a78374`](https://github.com/wallet-ui/wallet-ui/commit/7a78374c04e1e5b51e3e7adb3dc2b640d5a334cf)]:
    - @wallet-ui/core@1.1.0

## 1.0.0

### Major Changes

- [#6](https://github.com/wallet-ui/wallet-ui/pull/6) [`e46ae0c`](https://github.com/wallet-ui/wallet-ui/commit/e46ae0cc18f5be5467548d4e13ab3fc5fc65a1f4) Thanks [@beeman](https://github.com/beeman)! - initial commit

### Patch Changes

- Updated dependencies [[`e46ae0c`](https://github.com/wallet-ui/wallet-ui/commit/e46ae0cc18f5be5467548d4e13ab3fc5fc65a1f4)]:
    - @wallet-ui/core@1.0.0
