---
"@wallet-ui/react-native-web3js": major
---

BREAKING: Migrate from TanStack Query to nanostores for authorization state management

- Replace TanStack Query hooks with nanostores authorization store
- Remove `@tanstack/react-query` peer dependency
- Add `nanostores` and `@nanostores/react` as dependencies
- Remove `useAuthorizationStorage`, `useFetchAuthorization`, `usePersistAuthorization` hooks
- Add `createAuthorizationStore` factory and `useAuthorizationStore` hook
- Simplify setup: TanStack Query provider no longer required
