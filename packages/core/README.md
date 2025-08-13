[![npm][npm-image]][npm-url]
[![npm-downloads][npm-downloads-image]][npm-url]
<br />
[![code-style-prettier][code-style-prettier-image]][code-style-prettier-url]

[code-style-prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[code-style-prettier-url]: https://github.com/prettier/prettier
[npm-downloads-image]: https://img.shields.io/npm/dm/@wallet-ui/core/latest.svg?style=flat
[npm-image]: https://img.shields.io/npm/v/@wallet-ui/core/latest.svg?style=flat
[npm-url]: https://www.npmjs.com/package/@wallet-ui/core/v/latest

# @wallet-ui/core

`@wallet-ui/core` is the framework-agnostic foundation of Wallet UI. It provides the necessary building blocks for state management and configuration that power the UI components and hooks in other packages like `@wallet-ui/react`.

## Core Features

- **State Management:** Uses [Nanostores](https://github.com/nanostores/nanostores) to create and manage the global state for the selected wallet, account, and cluster.
- **Persistence:** Handles saving the user's wallet and cluster selection to `localStorage`, so their choices are remembered across sessions.
- **Configuration:** Provides helper functions (e.g., `createSolanaDevnet`) for defining the clusters your application will support.

## Usage

This package is generally used as a peer dependency of a framework-specific adapter like `@wallet-ui/react` and is not typically installed or used directly.

For complete documentation, please visit [wallet-ui.dev/docs/core](https://wallet-ui.dev/docs/core).
