---
'@wallet-ui/react-native-kit': patch
'@wallet-ui/react-native-web3js': patch
---

Require `@solana-mobile/mobile-wallet-adapter-protocol`, `-protocol-kit`, and `-protocol-web3js` 3.0.1 or later. The 3.0.0 React Native builds of the kit and web3js wrappers import `startRemoteScenario` from the protocol package, whose React Native build does not export it, so strict ESM loaders such as vitest fail to load `@wallet-ui/react-native-kit` and `@wallet-ui/react-native-web3js` with "does not provide an export named 'startRemoteScenario'". 3.0.1 fixes that, and the `^3.0.1` range also keeps pnpm 12's release-age cooldown from resolving back to 3.0.0.
