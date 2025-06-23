const chalk = require("chalk");

const MorganTokenizer = ({ WORKER_NAME }) => (tokens, req, res) => {
  const status = tokens.status(req, res);
  const statusColor = status >= 500
    ? "red" : status >= 400
      ? "yellow" : status >= 300
        ? "cyan" : "green";

  const logTokens = [
    `[WORKER: ${WORKER_NAME}]`,
    tokens.method(req, res),
    tokens.url(req, res),
    chalk[statusColor](status),
    tokens["response-time"](req, res), "ms",
    req.ip,
  ];

  if (req.locals && req.locals.session) {
    logTokens.push(chalk.bold(req.locals.session.id));
    logTokens.push(chalk.bold(req.locals.session.user.id));
  }

  if (res.statusCode >= 400) {
    logTokens.push(chalk.bold("Request:"), JSON.stringify(req.body));
    logTokens.push(chalk.bold("Response:"), JSON.stringify(res.__x_response_body));
  }

  return logTokens.join(" ");
};

module.exports = MorganTokenizer;
