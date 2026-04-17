# @wallet-ui/react-native-web3js

## 4.0.4

### Patch Changes

- [#480](https://github.com/wallet-ui/wallet-ui/pull/480) [`3b27018`](https://github.com/wallet-ui/wallet-ui/commit/3b270183a29088cc27a87dbb699d9cc0ea51669c) Thanks [@beeman](https://github.com/beeman)! - Update the React Native package manifests to the latest `@solana-mobile` mobile wallet adapter protocol releases for the kit and web3js adapters.

- Updated dependencies []:
    - @wallet-ui/core@4.0.4

## 4.0.3

### Patch Changes

- [#467](https://github.com/wallet-ui/wallet-ui/pull/467) [`96d7aa9`](https://github.com/wallet-ui/wallet-ui/commit/96d7aa96357695092b2a36fa5d590bafe374cef0) Thanks [@beeman](https://github.com/beeman)! - Migrate the published packages to a TypeScript 6-compatible configuration.

    Switch the shared package TypeScript settings to `bundler` resolution, move the package library baselines to `ES2024`, and add the declaration and CSS typing updates needed for the workspace to build cleanly on TypeScript 6.

- [#474](https://github.com/wallet-ui/wallet-ui/pull/474) [`afe5a9d`](https://github.com/wallet-ui/wallet-ui/commit/afe5a9de73bddd63b3f13681359d9bfd40527d5c) Thanks [@beeman](https://github.com/beeman)! - Update the React Native packages to the latest `@solana-mobile` mobile wallet adapter protocol dependencies.

    Bump `@wallet-ui/react-native-kit` to `@solana-mobile/mobile-wallet-adapter-protocol@^2.2.7` and `@solana-mobile/mobile-wallet-adapter-protocol-kit@^0.3.0`, and bump `@wallet-ui/react-native-web3js` to `@solana-mobile/mobile-wallet-adapter-protocol@^2.2.7` and `@solana-mobile/mobile-wallet-adapter-protocol-web3js@^2.2.7`.

- Updated dependencies [[`96d7aa9`](https://github.com/wallet-ui/wallet-ui/commit/96d7aa96357695092b2a36fa5d590bafe374cef0)]:
    - @wallet-ui/core@4.0.3

## 4.0.2

### Patch Changes

- Updated dependencies []:
    - @wallet-ui/core@4.0.2

## 4.0.1

### Patch Changes

- [#445](https://github.com/wallet-ui/wallet-ui/pull/445) [`7fbb49b`](https://github.com/wallet-ui/wallet-ui/commit/7fbb49bc924fe77f1e13a02db3af446a1cfdd5c1) Thanks [@beeman](https://github.com/beeman)! - export symbols from convert-sign-in-result

- Updated dependencies []:
    - @wallet-ui/core@4.0.1

## 4.0.0

### Major Changes

- [#437](https://github.com/wallet-ui/wallet-ui/pull/437) [`e7dc7a7`](https://github.com/wallet-ui/wallet-ui/commit/e7dc7a714c6b204692b80d621b939e54d155730a) Thanks [@beeman](https://github.com/beeman)! - sign in should return message and signature

- [#438](https://github.com/wallet-ui/wallet-ui/pull/438) [`40973a7`](https://github.com/wallet-ui/wallet-ui/commit/40973a7d8ebb24c279e318136c79414ada89973d) Thanks [@beeman](https://github.com/beeman)! - remove @wallet-ui/react-gill package

### Minor Changes

- [#443](https://github.com/wallet-ui/wallet-ui/pull/443) [`1dfcaae`](https://github.com/wallet-ui/wallet-ui/commit/1dfcaae077a93ca9cece1623089a863a4badc07d) Thanks [@beeman](https://github.com/beeman)! - Add plural wallet method names and keep singular names as deprecated aliases.

### Patch Changes

- Updated dependencies [[`1eebc40`](https://github.com/wallet-ui/wallet-ui/commit/1eebc4046573984b9b1666ad7e0865c4fa076bc5), [`40973a7`](https://github.com/wallet-ui/wallet-ui/commit/40973a7d8ebb24c279e318136c79414ada89973d)]:
    - @wallet-ui/core@4.0.0

## 3.3.0

### Minor Changes

- [#431](https://github.com/wallet-ui/wallet-ui/pull/431) [`2bdd302`](https://github.com/wallet-ui/wallet-ui/commit/2bdd302d836fec8883a86c556b14f3837c0c5294) Thanks [@MattMsh](https://github.com/MattMsh)! - enhance signAndSendTransaction return type

### Patch Changes

- [#405](https://github.com/wallet-ui/wallet-ui/pull/405) [`fe20545`](https://github.com/wallet-ui/wallet-ui/commit/fe20545b054e97b661f852ddd6e9a64de70b8b9d) Thanks [@pratikbuilds](https://github.com/pratikbuilds)! - feat(mwa): signAndSendTransaction accepts single or array of transactions

- [#405](https://github.com/wallet-ui/wallet-ui/pull/405) [`fe20545`](https://github.com/wallet-ui/wallet-ui/commit/fe20545b054e97b661f852ddd6e9a64de70b8b9d) Thanks [@pratikbuilds](https://github.com/pratikbuilds)! - feat(mwa): signMessage accepts single or array of messages, signMessages removed

- Updated dependencies []:
    - @wallet-ui/core@3.3.0

## 3.2.1

### Patch Changes

- Updated dependencies [[`02c7d69`](https://github.com/wallet-ui/wallet-ui/commit/02c7d69a77c3b2b62171af5baad270faefea77d1)]:
    - @wallet-ui/core@3.2.1

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
