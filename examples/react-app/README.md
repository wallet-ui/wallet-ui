# @wallet-ui/example-react-app

This is an example of how to use `@wallet-ui/react` in a React web application.

## Developing

Start a server in development mode.

```shell
pnpm install
pnpm turbo compile:js compile:typedefs
pnpm dev
```

Press <kbd>o</kbd> + <kbd>Enter</kbd> to open the app in a browser. Edits to the source code will automatically reload
the app.

## Building for deployment

Build a static bundle and HTML for deployment to a webserver.

```shell
pnpm install
pnpm turbo build
```

The contents of the `dist/` directory can now be uploaded to a webserver.

## Enabling Mainnet-Beta

Access to this cluster is typically blocked by [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) rules, so
it is disabled in the example app by default. To enable it, start the server or compile the application with the
`REACT_EXAMPLE_APP_ENABLE_MAINNET` environment variable set to `"true"`.

```shell
REACT_EXAMPLE_APP_ENABLE_MAINNET=true pnpm dev
REACT_EXAMPLE_APP_ENABLE_MAINNET=true pnpm build
```
