// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
    dsn: 'https://0ceb3f281ecaf0e10bda75bdd81266d3@o4509832049065984.ingest.de.sentry.io/4509832055619664',
    // Enable logs to be sent to Sentry
    enableLogs: true,
    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,
});
