const { createProxyMiddleware } = require("http-proxy-middleware");
const Express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const { IS_TESTING } = require("../config");

const createRouter = require("./routes");
const createErrorHandlers = require("./errors");
const createMiddlewares = require("./middlewares");
const MorganTokenizer = require("../lib/morgan-tokenizer");

module.exports = (dependencies) => {
  const errorHandlers = createErrorHandlers(dependencies);
  const middlewares = createMiddlewares(dependencies);
  const router = createRouter({ ...dependencies, middlewares });
  const { config } = dependencies;

  const api = Express();
  
  const originalSend = api.response.send;
  api.response.send = function sendOverWrite(body) {
    originalSend.call(this, body);
    this.__x_response_body = body;
  };

  api.set("appName", "CDM API");
  api.set("trust proxy", true);
  api.disable("etag");
  api.disable("x-powered-by");
  api.use(cors());
  api.use(helmet());

  api.use("/test-node", createProxyMiddleware({
    target: config.CKB.NODE_URL,
    changeOrigin: true,
    logLevel: "debug",
  }));

  api.use(Express.json());
  
  if (!IS_TESTING) api.use(morgan(MorganTokenizer(dependencies.config)));

  api.use(router);
  api.get("*", errorHandlers.handleWildcard);
  api.use(errorHandlers.handleError);

  return api;
};

