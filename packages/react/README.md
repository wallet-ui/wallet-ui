[![npm][npm-image]][npm-url]
[![npm-downloads][npm-downloads-image]][npm-url]
<br />
[![code-style-prettier][code-style-prettier-image]][code-style-prettier-url]

[code-style-prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[code-style-prettier-url]: https://github.com/prettier/prettier
[npm-downloads-image]: https://img.shields.io/npm/dm/@wallet-ui/react/latest.svg?style=flat
[npm-image]: https://img.shields.io/npm/v/@wallet-ui/react/latest.svg?style=flat
[npm-url]: https://www.npmjs.com/package/@wallet-ui/react/v/latest

# @wallet-ui/react

This package provides the official React components and hooks for [Wallet UI](https://wallet-ui.dev), a modern, headless
UI component library for Solana apps.

## Features

- **Provider:** A single `<WalletUi>` provider to easily wrap your application and manage state.
- **Hooks:** A complete set of hooks (`useWalletUi`, `useWalletUiSigner`, etc.) that give you full control to build
  custom wallet interactions.
- **Components:** Pre-built components like `<WalletUiDropdown />` to get you started quickly.
- **Headless:** Built with a headless-first philosophy, allowing for maximum customization.

## Quick Start

```tsx
import { createSolanaDevnet, createWalletUiConfig, WalletUi, WalletUiDropdown } from '@wallet-ui/react';
import React from 'react';

// 1. Create your configuration
const config = createWalletUiConfig({
    clusters: [createSolanaDevnet()],
});

// 2. Wrap your app with the provider
function App() {
    return (
        <WalletUi config={config}>
            <YourApp />
        </WalletUi>
    );
}

// 3. Use the components anywhere in your app
function YourApp() {
    return (
        <div>
            <h2>My Awesome App</h2>
            <WalletUiDropdown />
        </div>
    );
}
```

## Documentation

For full documentation, including guides, component references, and hook APIs, please
visit [wallet-ui.dev/docs/react](https://wallet-ui.dev/docs/react).
