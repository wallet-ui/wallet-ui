# @wallet-ui/react-native-kit

## 4.0.5

### Patch Changes

- [#491](https://github.com/wallet-ui/wallet-ui/pull/491) [`50306a4`](https://github.com/wallet-ui/wallet-ui/commit/50306a463b69635f66b72850f00186d788420e6d) Thanks [@beeman](https://github.com/beeman)! - Revert the AsyncStorage dependency bump from `@react-native-async-storage/async-storage@^3.0.2` to `^2.2.0`.

    AsyncStorage `3.x` currently requires extra Android `local_repo` Maven wiring, which adds avoidable integration friction for Wallet UI consumers, especially Expo CNG and generated native projects. This rollback restores the previous internal dependency line without changing the public API surface.

- Updated dependencies []:
    - @wallet-ui/core@4.0.5

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

- [#396](https://github.com/wallet-ui/wallet-ui/pull/396) [`1eebc40`](https://github.com/wallet-ui/wallet-ui/commit/1eebc4046573984b9b1666ad7e0865c4fa076bc5) Thanks [@beeman](https://github.com/beeman)! - sign in should return message and signature

- [#438](https://github.com/wallet-ui/wallet-ui/pull/438) [`40973a7`](https://github.com/wallet-ui/wallet-ui/commit/40973a7d8ebb24c279e318136c79414ada89973d) Thanks [@beeman](https://github.com/beeman)! - remove @wallet-ui/react-gill package

### Minor Changes

- [#442](https://github.com/wallet-ui/wallet-ui/pull/442) [`41a1710`](https://github.com/wallet-ui/wallet-ui/commit/41a17107f084160491e1a5b4a3b3b0016d4aade9) Thanks [@beeman](https://github.com/beeman)! - Add plural wallet method names and keep singular names as deprecated aliases.

### Patch Changes

- Updated dependencies [[`1eebc40`](https://github.com/wallet-ui/wallet-ui/commit/1eebc4046573984b9b1666ad7e0865c4fa076bc5), [`40973a7`](https://github.com/wallet-ui/wallet-ui/commit/40973a7d8ebb24c279e318136c79414ada89973d)]:
    - @wallet-ui/core@4.0.0

## 3.3.0

### Minor Changes

- [#431](https://github.com/wallet-ui/wallet-ui/pull/431) [`2bdd302`](https://github.com/wallet-ui/wallet-ui/commit/2bdd302d836fec8883a86c556b14f3837c0c5294) Thanks [@MattMsh](https://github.com/MattMsh)! - enhance signAndSendTransaction return type

### Patch Changes

- [#405](https://github.com/wallet-ui/wallet-ui/pull/405) [`fe20545`](https://github.com/wallet-ui/wallet-ui/commit/fe20545b054e97b661f852ddd6e9a64de70b8b9d) Thanks [@pratikbuilds](https://github.com/pratikbuilds)! - feat(mwa): signMessage accepts single or array of messages, signMessages removed

- Updated dependencies []:
    - @wallet-ui/core@3.3.0

## 3.2.1

### Patch Changes

- [#415](https://github.com/wallet-ui/wallet-ui/pull/415) [`02c7d69`](https://github.com/wallet-ui/wallet-ui/commit/02c7d69a77c3b2b62171af5baad270faefea77d1) Thanks [@beeman](https://github.com/beeman)! - update @solana/kit dependencies

- Updated dependencies [[`02c7d69`](https://github.com/wallet-ui/wallet-ui/commit/02c7d69a77c3b2b62171af5baad270faefea77d1)]:
    - @wallet-ui/core@3.2.1

## 3.2.0

### Minor Changes

- [#400](https://github.com/wallet-ui/wallet-ui/pull/400) [`1a61c39`](https://github.com/wallet-ui/wallet-ui/commit/1a61c3901e1324e780d6cced5f331eb9b85db94b) Thanks [@MattMsh](https://github.com/MattMsh)! - add signTransaction function to useMobileWallet hook

### Patch Changes

- Updated dependencies []:
    - @wallet-ui/core@3.2.0

## 3.1.0

### Minor Changes

- [#389](https://github.com/wallet-ui/wallet-ui/pull/389) [`0a0021a`](https://github.com/wallet-ui/wallet-ui/commit/0a0021aa99dff8b9489522262b18254276f4da47) Thanks [@beeman](https://github.com/beeman)! - feat: add `sendTransaction` to `useMobileWallet`

- [#385](https://github.com/wallet-ui/wallet-ui/pull/385) [`d0942d7`](https://github.com/wallet-ui/wallet-ui/commit/d0942d7abdd87907411ca42b799a00cce62bc0cd) Thanks [@beeman](https://github.com/beeman)! - feat: implement `@wallet-ui/react-native-kit`

### Patch Changes

- Updated dependencies []:
    - @wallet-ui/core@3.1.0
