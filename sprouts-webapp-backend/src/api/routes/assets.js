const wrapThrow = require("express-async-handler");
const HttpStatus = require("http-status");
const { Router } = require("express");
const { createPrefixedId } = require("../../utils");

module.exports = ({ aws, middlewares }) => {
  const router = Router();

  router.post(
    "/pre-signed-urls",
    middlewares.withAuth.required,
    wrapThrow(async (req, res) => {
      const { user } = req.locals.session;
      const url = await aws.preSignURL({
        key: `users/${user.id}/avatars/${createPrefixedId("ast")}`
      });
      res.status(HttpStatus.OK).json({ preSignedUrl: url });
    })
  );

  return router;
};

