import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN || "https://03a38ec5d58945ae85e2fda0c594baf4@o942861.ingest.sentry.io/6040292",
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: 1.0,
});
