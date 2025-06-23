const HTTP = require("http-status");
const ERROR = require("http-errors");
const ApplicationError = require("../errors");
const { VERSION } = require("../config");
const { captureAndReportException } = require("../utils");

module.exports = () => ({
  /* eslint-disable-next-line no-unused-vars*/
  handleError: async (error, req, res, next) => {
    if (error.status) return res.status(error.status).json({ error: error.message });
    if (error instanceof ApplicationError) {
      switch (error.constructor) {
      default:
        return res.status(HTTP.BAD_REQUEST).json({ error: error.code });
      }
    }
    res.status(500).end();
    await captureAndReportException(error, {
      contexts: {
        version: VERSION,
        req: {
          body: req.body,
          url: req.url,
          method: req.method,
        }
      }
    });
    throw error;
  },
  handleWildcard: (req, res, next) => next(ERROR.NotFound("Not Found"))
});
