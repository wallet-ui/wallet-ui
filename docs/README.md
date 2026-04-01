# Wallet UI Docs

Documentation site for Wallet UI, covering the React SDK, React Native SDK, and the shared core package.

## Live site

- https://wallet-ui-astro.wallet-ui.workers.dev

## Local development

```bash
pnpm install
pnpm dev
```

Useful checks before finishing work:

```bash
pnpm check
pnpm build
```

Additional project commands:

```bash
pnpm preview
pnpm deploy
```

## What lives here

- Public docs content for Wallet UI packages and guides
- Branded assets, generated social previews, and site metadata
- Cloudflare deployment configuration for the docs site

## Content structure

- [`src/content/docs/index.mdx`](./src/content/docs/index.mdx): docs homepage
- [`src/content/docs/react/`](./src/content/docs/react/): React SDK guides and API references
- [`src/content/docs/react-native/`](./src/content/docs/react-native/): React Native package selection, guides, and references
- [`src/content/docs/core/`](./src/content/docs/core/): framework-agnostic core package docs
- [`src/components/docs/`](./src/components/docs/): reusable Starlight/Astro docs components

## Deployment

The site is deployed on Cloudflare Workers.

- Cloudflare Workers Builds should connect this repository and deploy the configured production branch.
- GitHub Actions in this repo are CI only: install, `pnpm check`, `pnpm build`, and a safe Wrangler dry-run validation.
- `pnpm deploy` is an authenticated manual Wrangler deploy, not the normal day-to-day deployment path.

### Cloudflare setup

1. Connect this repository to the target Cloudflare account.
2. Use the Worker service name `wallet-ui-astro`.
3. Configure the production branch for the Worker build.
4. Confirm the deployed site is live at `https://wallet-ui-astro.wallet-ui.workers.dev`.
5. If a custom hostname is added later, bind it to the same Worker in Cloudflare and proxy its DNS record.

## Analytics and observability

Cloudflare Web Analytics is enabled when `PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` is set in the Cloudflare build environment:

```bash
PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN=<cloudflare-web-analytics-site-token>
```

1. In Cloudflare, create or open the Web Analytics site for the target hostname.
2. Copy the site token from the Cloudflare Web Analytics snippet.
3. Set `PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` in the Cloudflare build/deploy environment for this project.
4. Deploy the site and confirm pageviews begin appearing in Cloudflare Web Analytics.

Worker observability is enabled in `wrangler.toml`:

```toml
[observability]
enabled = true
```

This keeps request and error telemetry enabled at the Worker level from repo config.
