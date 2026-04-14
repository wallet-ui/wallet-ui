# Examples

## One-time setup

Start by installing all dependencies.

```shell
pnpm install
```

Most examples use a local test Solana validator. Install one by running the following command in the root of this monorepo.

```shell
pnpm test:live-with-test-validator:setup
```

## Run an example

In the directory of a given example, run its start script.

```shell
pnpm start
```

## Expo native-entry smoke tests

The Expo smoke coverage bundles the Expo examples through Expo's native iOS path and asserts that the workspace packages resolve `dist/index.native.mjs`, not `dist/index.node.cjs`.

These smoke checks require prebuilt workspace `dist/` artifacts. If the workspace packages have not been built yet, run the following command from the repository root first. A missing `dist/` file is a build prerequisite failure, not a native-entry regression.

```shell
pnpm build
```

Run the Expo native-entry smoke checks from the repository root with the following command.

```shell
pnpm test:examples:native-entry
```
