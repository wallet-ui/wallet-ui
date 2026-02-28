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

### Running Examples

To run a specific example:
1. Navigate to the example directory (e.g., `cd examples/react-app`).
2. Run `pnpm start` (or `pnpm dev` depending on the example's package.json).

*Note: Most examples expect a local Solana validator running if configured for localnet.*
