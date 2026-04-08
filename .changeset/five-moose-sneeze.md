---
'@wallet-ui/core': patch
'@wallet-ui/css': patch
'@wallet-ui/react': patch
'@wallet-ui/react-native-kit': patch
'@wallet-ui/react-native-web3js': patch
'@wallet-ui/tailwind': patch
---

Migrate the published packages to a TypeScript 6-compatible configuration.

Switch the shared package TypeScript settings to `bundler` resolution, move the package library baselines to `ES2024`, and add the declaration and CSS typing updates needed for the workspace to build cleanly on TypeScript 6.
