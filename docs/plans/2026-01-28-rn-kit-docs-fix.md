# Documentation Fixes for React Native Kit Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix discrepancies between the `@wallet-ui/react-native-kit` documentation and the actual implementation/usage.

**Architecture:** Update MDX files to reflect the required props and return values of the hooks.

**Tech Stack:** Markdown, MDX.

---

### Task 1: Update useAuthorization Documentation

**Files:**

- Modify: `docs/content/docs/react-native/kit/hooks/use-authorization.mdx`

**Step 1: Update the Example Code**

The current example is invalid because it misses the required `store` prop and `cache` setup.

- Read `docs/content/docs/react-native/kit/hooks/use-authorization.mdx` to confirm current content.
- Update the example code block to include `createAsyncStorageCache` and `createAuthorizationStore` setup.

```tsx
import { createAsyncStorageCache, createAuthorizationStore, useAuthorization } from '@wallet-ui/react-native-kit';
import { useCallback, useMemo } from 'react';
import { Button, Text, View } from 'react-native';

// Create a store instance (usually done at a higher level or inside a provider)
const cache = createAsyncStorageCache();
const store = createAuthorizationStore({ cache });

function MyComponent() {
    // Note: useAuthorization is typically used internally by MobileWalletProvider
    const { accounts, authorizeSession, selectedAccount } = useAuthorization({
        chain: 'solana:mainnet',
        identity: {
            name: 'My App',
        },
        store, // Required
        cache, // Optional, but good practice if you have it
    });

    // ... rest of the component
}
```

**Step 2: Add Note about Internal Usage**

- Add a callout or note emphasizing that this is a low-level hook and most users should use `useMobileWallet` instead.

### Task 2: Update useMobileWallet Documentation

**Files:**

- Modify: `docs/content/docs/react-native/kit/hooks/use-mobile-wallet.mdx`

**Step 1: Add `chain` to Return Value Table**

- Read `docs/content/docs/react-native/kit/hooks/use-mobile-wallet.mdx`.
- Add the `chain` property to the "Return Value" table.

| Name    | Type              | Description                                               |
| :------ | :---------------- | :-------------------------------------------------------- |
| `chain` | `SolanaClusterId` | The current cluster identifier (e.g., `'solana:devnet'`). |

**Step 2: Verify other return values**

- Ensure all other return values match the implementation.

### Task 3: Review Changes

**Step 1: Verify MDX Syntax**

- Ensure no syntax errors were introduced in the MDX files.

**Step 2: Verify Example Correctness**

- Double-check that the new example code in `use-authorization.mdx` imports all necessary symbols from `@wallet-ui/react-native-kit`.
