---
'@wallet-ui/core': major
---

Breaking changes to default cluster creation functions

### Breaking Change

The behavior of the default cluster creation functions (`createSolanaDevnet`, `createSolanaMainnet`, etc.) has been changed. They now return full RPC URLs instead of symbolic names.

**What changed (Breaking):**
- Calling a creation function like `createSolanaDevnet()` with no arguments will now return a cluster with a full URL, e.g., `url: 'https://api.devnet.solana.com'`. Previously, it returned a symbolic name, e.g., `url: 'devnet'`. This is a breaking change for anyone who was relying on the symbolic names.

**What changed (Non-Breaking):**
- To support more flexible RPC configurations, the `SolanaCluster` interface now has an optional `urlWs` property for a dedicated WebSocket endpoint.
- The creation functions have been updated to accept a `urlWs` property.
- `createSolanaLocalnet` will now automatically infer a WebSocket URL (e.g., `ws://localhost:8900`) if a standard HTTP URL is provided (e.g., `http://localhost:8899`).

**Why this change was made:**
To improve the developer experience with better defaults and to provide more flexibility by allowing separate RPC and WebSocket URLs.

**How to update your code:**
- If your code checks for symbolic cluster names (e.g., `if (cluster.url === 'devnet')`), you must update it to handle full RPC URLs.
- If you have a custom WebSocket endpoint, you can now provide it via the `urlWs` property when creating a `SolanaCluster`.