/* eslint-disable no-console */

const assert = require("assert");
assert(process.env.NODE_ENV, "Env var NODE_ENV must be set when running the app");

const cluster = require("cluster");
const config = require("./config");
const Sentry = require("@sentry/node");
// eslint-disable-next-line no-unused-vars
const Tracing = require("@sentry/tracing");
const { VERSION } = require("lodash");

const resolveDependenciesAndLoadApp = require("./loader");
const { captureAndReportException } = require("./utils");
const { NODE_ENV } = require("./config");

Sentry.init({
  dsn: "https://234f774e0eeb40eaa17fee1dbc5adbe2@o942861.ingest.sentry.io/6040290",
  tracesSampleRate: 1.0,
  serverName: "CDM Backend",
  enabled: config.IS_PRODUCTION,
  environment: NODE_ENV,
  release: VERSION,
  sampleRate: 1,
});

let serverInstance;
let databaseInstance;

const app = async (config) => {
  const { API: { PORT, HOST }, NODE_ENV } = config;
  assert(NODE_ENV, "Specify NODE_ENV in environment");

  const { api, database } = await resolveDependenciesAndLoadApp(config);
  databaseInstance = database;
  serverInstance = await api.listen(PORT, HOST);
};

if (config.SHOULD_CLUSTER && cluster.isMaster) {
  const cpuCount = require("os").cpus().length;
  for (let i = 0; i < config.CLUSTER_MAX_INSTANCES && i < cpuCount; i += 1) {
    cluster.fork({ WORKER_NUMBER: i + 1 });
  }
  cluster.on("exit", ({ id, process: { pid } }, code) => {
    console.warn(`[WORKER #${id} DIED AT PROCESS ${pid} WITH CODE ${code}]`);
    cluster.fork({ WORKER_NUMBER: id });
  });
} else {
  console.time(`WORKER ${config.WORKER_NAME} | PORT #${config.API.PORT} | BOOT TIME`);
  app(config)
    .then(() => {
      console.timeEnd(`WORKER ${config.WORKER_NAME} | PORT #${config.API.PORT} | BOOT TIME`);
    });
}

/**
 * Kills the process gracefully-ish.
 *
 * @param {string} reason 									Reason why this process was triggered.
 * @param {error} error 										Stack trace.
 * @param {Promise<void>}
 */
const dieGracefully = async (reason, error) => {
  console.log(error);
  if (serverInstance) await serverInstance.close();
  if (databaseInstance) await databaseInstance.connection.close();
  console.error(`Terminating gracefully | Reason: ${reason} | Error: ${error}`);
  if (error) {
    await captureAndReportException(error);
    process.exit(1);
  }
  else process.exit(0);
};

process.on("unhandledRejection", (err) => dieGracefully("unhandledRejection", err));
process.on("uncaughtException", (err) => dieGracefully("unhandledException", err));
process.on("SIGTERM", () => dieGracefully("SIGTERM"));
process.on("SIGINT", () => dieGracefully("SIGINT"));
