---
'@wallet-ui/react-gill': major
'@wallet-ui/core': major
---

Add http and ws properties to SolanaCluster

### Breaking Change

The `SolanaCluster` interface has been updated to better support different RPC and WebSocket URLs.

**What changed:**
- The `url` property on `SolanaCluster` is now optional and has been deprecated.
- A new required property `http` has been added. It serves the same purpose as the old `url` property.
- An optional `ws` property has been added for WebSocket URLs.

**Why this change was made:**
To provide more flexibility in specifying different URLs for HTTP and WebSocket connections to a Solana cluster.

**How to update your code:**
- If you were creating `SolanaCluster` objects, you must now provide the `http` property. For backward compatibility, you can set both `url` and `http` to the same value.
- If you were consuming `SolanaCluster` objects, you should now use the `http` property instead of `url`. You will also need to handle the possibility that `url` is `undefined`.
- The cluster creation functions (`createSolanaDevnet`, etc.) are updated and will return objects with both `url` and `http` properties set to the same value.

Example:
Before:
```typescript
const endpoint = myCluster.url;
```

After:
```typescript
const endpoint = myCluster.http;
```