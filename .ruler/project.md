# Project: Wallet UI

This repository is a monorepo containing the source code for the `wallet-ui` library and its examples.

## Repository Context

- **Package Manager**: `pnpm`
- **Monorepo Manager**: `turbo` and `pnpm` workspaces.
- **Main Languages**: TypeScript, React, CSS/Tailwind.

## Directory Structure

### `@packages/**`
These directories contain the core libraries that are published to npm. They are the source code of the `wallet-ui` ecosystem.

- **`@wallet-ui/core`**: Framework-agnostic core logic, state management (using `nanostores`), and utilities.
- **`@wallet-ui/react`**: React adapters, hooks (`useWalletUi`), and providers (`WalletUiProvider`) for web applications.
- **`@wallet-ui/react-native-web3js`**: React Native adapters and hooks for mobile applications.
- **`@wallet-ui/css`**: Base CSS styles for Wallet UI components.
- **`@wallet-ui/tailwind`**: Tailwind CSS configuration and preset styles for Wallet UI.
- **`@wallet-ui/playground-react`**: A collection of playground components used for testing and demonstrating functionality within the examples.

### `@examples/**`
These directories contain example applications demonstrating how to consume the `@packages` in different environments. They are **not** published to npm.

- **`expo-web3js`**: A React Native Expo application using `@wallet-ui/react-native-web3js`.
- **`next-shadcn`**: A Next.js application integrating Wallet UI with Shadcn UI.
- **`next-tailwind`**: A Next.js application using Wallet UI with Tailwind CSS.
- **`react-app`**: A basic Vite React application showing fundamental usage.
- **`react-vite-tailwind`**: A Vite React application using Wallet UI with Tailwind CSS.

## Build & Development Commands

Run these commands from the root directory:

- **Install dependencies**: `pnpm install`
- **Build all packages**: `pnpm build` (runs `turbo run build`)
- **Compile JS & Typedefs**: `pnpm compile`
- **Lint**: `pnpm lint`
- **Run Unit Tests**: `pnpm test` (runs browser and node unit tests)
- **Setup Live Test Validator**: `pnpm test:live-with-test-validator:setup` (Required for running examples with localnet)
- **Run Live Tests**: `pnpm test:live-with-test-validator`
- Prefix turbo commands with `FORCE=true` when you need uncached results during verification or debugging.

## Testing Guidance

### General

- **Direct inline assertions**: Prefer direct `expect(...)` calls in the test body over custom assertion helpers when writing Jest tests. This keeps paired suites easier to compare and avoids `jest/expect-expect` false negatives.
- **Dual-environment verification**: For package-level test work, treat `test:unit:browser`, `test:unit:node`, `test:lint`, and `test:typecheck` as the normal verification set.
- **Explicit assertion counts**: When adding or refactoring Jest tests with async or mock-heavy control flow, start each test with `expect.assertions(n)` so the expected assertion count is visible in the test itself.
- **Import-first test files**: Prefer normal imports first in Jest test files when the current setup supports it. This repo's Jest setup hoists `jest.mock(...)`, so readability wins unless a specific file proves otherwise.
- **Package-scoped iteration**: Prefer `pnpm --filter <package> ...` commands while iterating so verification stays fast and scoped to the package under change.

### React Native Packages

- **AsyncStorage and native mocks**: Mock React Native native modules and the Solana Mobile transport boundary in unit tests so the suites never depend on real native implementations.
- **Package-local hook renderers**: Keep `react-test-renderer`-based hook helpers under each React Native package's `src/test-utils` so `react` and `react-test-renderer` resolve from the package under test instead of from `packages/test-config`.
- **Shared RN test utilities**: Keep version-insensitive helpers such as `resetAsyncStorageMock` in `packages/test-config/react-native-unit-test-utils.tsx` so shared native-module mock reset logic stays centralized without reintroducing cross-package React resolution.
- **Surface-specific coverage**: Add package-specific tests only when the runtime API truly differs. Current examples: `@wallet-ui/react-native-kit` exposes `getTransactionSigner`, `sendTransaction`, and `sendTransactions`, while `@wallet-ui/react-native-web3js` exposes `PublicKey`-specific account behavior.
- **Symmetric paired suites**: Keep matching `@wallet-ui/react-native-kit` and `@wallet-ui/react-native-web3js` tests as mechanically similar as possible. Use the same fixture names, assertion style, and test ordering, and isolate only real API differences into dedicated package-specific tests.

### Clean Checkout Build Notes

- Example apps are **not** standalone from a pristine checkout. Workspace packages such as `@wallet-ui/react` and `@wallet-ui/playground-react` export built `dist/` artifacts, so a direct example build can fail before prerendering if those workspace packages have not been compiled yet.
- What is missing today is an automatic example-local prebuild path. There is no example `build` hook that compiles required workspace packages first, and the workspace packages do not expose source entrypoints that let the examples build cleanly without prebuilt `dist/`.
- For reliable builds or debugging from a clean checkout, prefer a root Turbo build that includes dependencies. For the Next.js examples, use `pnpm turbo run build --force --filter=next-shadcn --filter=@wallet-ui/example-next-tailwind`.
- After the relevant workspace packages have been built, direct example commands such as `pnpm --dir examples/next-shadcn build` and `pnpm --dir examples/next-tailwind build` become meaningful for app-only verification.
- If a clean direct example build fails with `Module not found: Can't resolve '@wallet-ui/react'`, treat that as a workspace build prerequisite problem, not as proof of a Next.js prerender or storage regression.

### Running Examples

To run a specific example:
1. Navigate to the example directory (e.g., `cd examples/react-app`).
2. Run `pnpm start` (or `pnpm dev` depending on the example's package.json).

*Note: Most examples expect a local Solana validator running if configured for localnet.*
