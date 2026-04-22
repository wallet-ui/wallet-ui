---
'@wallet-ui/react-native-kit': patch
'@wallet-ui/react-native-web3js': patch
---

Revert the AsyncStorage dependency bump from `@react-native-async-storage/async-storage@^3.0.2` to `^2.2.0`.

AsyncStorage `3.x` currently requires extra Android `local_repo` Maven wiring, which adds avoidable integration friction for Wallet UI consumers, especially Expo CNG and generated native projects. This rollback restores the previous internal dependency line without changing the public API surface.
