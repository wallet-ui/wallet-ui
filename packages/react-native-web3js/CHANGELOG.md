# @wallet-ui/react-native-web3js

## 3.2.0

### Minor Changes

- [#400](https://github.com/wallet-ui/wallet-ui/pull/400) [`1a61c39`](https://github.com/wallet-ui/wallet-ui/commit/1a61c3901e1324e780d6cced5f331eb9b85db94b) Thanks [@MattMsh](https://github.com/MattMsh)! - add signTransaction function to useMobileWallet hook

### Patch Changes

- Updated dependencies []:
    - @wallet-ui/core@3.2.0

## 3.1.0

### Patch Changes

- Updated dependencies []:
    - @wallet-ui/core@3.1.0

## 3.0.0

### Major Changes

- [#379](https://github.com/wallet-ui/wallet-ui/pull/379) [`b3468f8`](https://github.com/wallet-ui/wallet-ui/commit/b3468f8619a7b1064d7d0ee8ca4f7bb2ba479c80) Thanks [@beeman](https://github.com/beeman)! - BREAKING: Migrate from TanStack Query to nanostores for authorization state management
    - Replace TanStack Query hooks with nanostores authorization store
    - Remove `@tanstack/react-query` peer dependency
    - Add `nanostores` and `@nanostores/react` as dependencies
    - Remove `useAuthorizationStorage`, `useFetchAuthorization`, `usePersistAuthorization` hooks
    - Add `createAuthorizationStore` factory and `useAuthorizationStore` hook
    - Simplify setup: TanStack Query provider no longer required

- [#381](https://github.com/wallet-ui/wallet-ui/pull/381) [`b102991`](https://github.com/wallet-ui/wallet-ui/commit/b102991a29400b5a00b4efdbba39fc02f84a0f15) Thanks [@beeman](https://github.com/beeman)! - Refactor: deprecate `Account.publicKey` in favor of `Account.address` in `react-native-web3js` package.

### Patch Changes

- [#382](https://github.com/wallet-ui/wallet-ui/pull/382) [`7c2108e`](https://github.com/wallet-ui/wallet-ui/commit/7c2108e9ac17d59dfaa19b561a1bc65d101a32ac) Thanks [@beeman](https://github.com/beeman)! - fix(react-native-web3js): ensure to initialize a single store

- Updated dependencies [[`0264164`](https://github.com/wallet-ui/wallet-ui/commit/0264164a9b131b636d22564300163b97b759ee31)]:
    - @wallet-ui/core@3.0.0

## 2.2.2

### Patch Changes

- [#374](https://github.com/wallet-ui/wallet-ui/pull/374) [`2818faf`](https://github.com/wallet-ui/wallet-ui/commit/2818faf7dd47d9b2614706ab2eb8e6f36de4ac79) Thanks [@beeman](https://github.com/beeman)! - abstract storage logic into a cache interface

- [#371](https://github.com/wallet-ui/wallet-ui/pull/371) [`0f0de27`](https://github.com/wallet-ui/wallet-ui/commit/0f0de27d22a53dfe873a0221ff8832d2e0cd83bf) Thanks [@beeman](https://github.com/beeman)! - clean up and isolate usage of authorization storage

- Updated dependencies []:
    - @wallet-ui/core@2.2.2

## 2.2.1

### Patch Changes

- [#369](https://github.com/wallet-ui/wallet-ui/pull/369) [`6ae8da3`](https://github.com/wallet-ui/wallet-ui/commit/6ae8da31f67fa4a166437f6ed49894da7df06c54) Thanks [@beeman](https://github.com/beeman)! - replace `@solana/signers` with `@solana/kit` as a peer dependency

- Updated dependencies []:
    - @wallet-ui/core@2.2.1

## 2.2.0

### Minor Changes

- [#307](https://github.com/wallet-ui/wallet-ui/pull/307) [`a4b9603`](https://github.com/wallet-ui/wallet-ui/commit/a4b9603ba3dd76e48d9731f0fcd4477dffcc30a0) Thanks [@beeman](https://github.com/beeman)! - implement `@wallet-ui/react-native-web3js`

- [#341](https://github.com/wallet-ui/wallet-ui/pull/341) [`a57ddd6`](https://github.com/wallet-ui/wallet-ui/commit/a57ddd694b6556e45b7fc4adbb8877428d610f6d) Thanks [@shibu0x](https://github.com/shibu0x)! - implement invalid auth_token retry handling

### Patch Changes

- Updated dependencies []:
    - @wallet-ui/core@2.2.0
