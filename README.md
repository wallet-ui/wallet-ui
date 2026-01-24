# Wallet UI

A modern UI component library for Solana apps, built on the Wallet Standard.

This monorepo contains the core packages, documentation, and examples for Wallet UI.

- `packages/core`: Framework-agnostic state management using Nanostores.
- `packages/react`: React components and hooks.
- `packages/tailwind`: Tailwind CSS presets for the components.
- `docs`: The documentation and project website, built with Next.js and Fumadocs.
- `examples`: Example applications demonstrating how to use Wallet UI.

For comprehensive documentation and usage guides, please visit [wallet-ui.dev](https://wallet-ui.dev).

## Getting started

```shell
git clone https://github.com/wallet-ui/wallet-ui.git
cd wallet-ui
pnpm install
# If you want to install rules for your AI agents (see below).
pnpm ruler apply --local-only
```

## Development

### Build

```shell
pnpm run build
```

### Lint

Run the linter:

```shell
pnpm run lint
```

Fix any linting issues:

```shell
pnpm run style:fix
```

### Test

```shell
pnpm run test
```

### AI Agents

We use [Ruler](https://github.com/beeman/ruler) to centralize AI agent instructions, coding guidelines, and project context.
You can find these resources in the `.ruler` directory.

To sync the instructions for your preferred AI agents, run:

```shell
pnpm ruler apply --local-only
```

This will update the project's agent-specific configuration files (like `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, etc.) based on the shared definitions in `.ruler`.

## Support

If you have any questions about this repo, feel free to reach out to [Telegram](https://t.me/beemandev)
or [X](https://x.com/beeman_nl).
