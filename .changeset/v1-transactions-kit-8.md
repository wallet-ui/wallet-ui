---
'@wallet-ui/core': major
'@wallet-ui/react': major
'@wallet-ui/react-native-kit': major
'@wallet-ui/react-native-web3js': major
---

Support Solana version 1 transactions and move to `@solana/kit` 8.

**Breaking**

- `@wallet-ui/react` and `@wallet-ui/react-native-kit` now require `@solana/kit@^8.3.0`. `@wallet-ui/react` re-exports `@solana/react@8.3.0`, whose hooks only work with Kit 8. `@wallet-ui/core` accepts Kit 6, 7 and 8 since it only uses types.
- `@wallet-ui/react-native-web3js` requires `@solana/web3.js@^1.99.0`, the first release with `MessageV1` and `TransactionVersion = 'legacy' | 0 | 1`.
- The `mobileWallet()` client plugin now simulates each planned transaction message to estimate and set its compute unit limit (and, for version 1 messages, the loaded accounts data size limit) before signing, matching `rpcTransactionPlanExecutor` from `@solana/kit-plugin-rpc`. Pass `estimateResourceLimits: false` to restore the previous behaviour, and keep it in sync with the same option of `rpcTransactionPlanner`.

**New**

- `useWalletUiTransactionVersions({ account })` and `getWalletUiAccountTransactionVersions(account)` in `@wallet-ui/react` return the transaction versions the connected wallet advertises, so an app can build a version 1 transaction only when the wallet supports it.
- `sendTransactions(instructions, options)` in `@wallet-ui/react-native-kit` accepts `version`, `computeUnitLimit`, `loadedAccountsDataSizeLimit` and `estimateResourceLimits`. It still builds version 0 by default; a version 1 message without explicit limits is simulated to fill them in, because a version 1 transaction without a compute unit limit is budgeted zero compute units.
- `mobileWallet()` accepts `getComputeUnitLimitFromEstimate` to replace the default compute unit buffer.
- The `SendTransactionsOptions` and `TransactionSignatures` types are exported from `@wallet-ui/react-native-kit`.

**Fixed**

- `@wallet-ui/react` pins `@wallet-standard/*` to the versions `@solana/react@8.3.0` depends on, so a single wallet registry is installed.
- `@wallet-ui/react-native-web3js` no longer depends on `@solana/react`, which it never used.
