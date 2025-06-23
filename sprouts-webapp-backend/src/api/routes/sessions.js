const wrapThrow = require("express-async-handler");
const addMinutes = require("date-fns/addMinutes");
const HttpStatus = require("http-status");
const { Router } = require("express");

const { validate, schemas } = require("../validations");
const { nanoid } = require("../../utils");

module.exports = ({ useCases, jwtManager, middlewares }) => {
  const router = Router();

  router.post(
    "/tokens",
    middlewares.withAuth.required,
    wrapThrow(async (req, res) => {
      const sessionId = req.locals.session.id;
      const session = await useCases.session.refreshById(sessionId);
      res.status(HttpStatus.OK).json(session);
    })
  );
  
  router.post(
    "/google",
    validate(schemas.session.create.google),
    wrapThrow(async (req, res) => {
      const { token } = req.locals.sanitized.body;
      const userAgent = req.get("User-Agent");
      const userIp = req.ip;
      const context = { userAgent, userIp };
      const session = await useCases.session.create.withGoogle(token, context);
      res.status(HttpStatus.CREATED).json(session);
    })
  );

  router.post(
    "/facebook",
    validate(schemas.session.create.facebook),
    wrapThrow(async (req, res) => {
      const { token } = req.locals.sanitized.body;
      const userAgent = req.get("User-Agent");
      const userIp = req.ip;
      const context = { userAgent, userIp };
      const session = await useCases.session.create.withFacebook(token, context);
      res.status(HttpStatus.CREATED).json(session);
    })
  );

  router.post(
    "/metamask",
    validate(schemas.session.create.metamask),
    wrapThrow(async (req, res) => {
      const { body } = req.locals.sanitized;
      const userAgent = req.get("User-Agent");
      const userIp = req.ip;
      const context = { userAgent, userIp };
      const session = await useCases.session.create.withMetamask(body, context);
      res.status(HttpStatus.CREATED).json(session);
    })
  );

  router.post(
    "/signature-challenges",
    wrapThrow(async (req, res) => {
      const challenge = `Log in with metamask: ${nanoid()}`;
      const expiresAt = addMinutes(new Date(), 2).toISOString();
      const jwt = await jwtManager.signAsync({ challenge, expiresAt });
      res.status(HttpStatus.CREATED).json({ jwt, challenge });
    })
  );

  router.post(
    "/phone",
    validate(schemas.session.create.phone),
    wrapThrow(async (req, res) => {
      const { token } = req.locals.sanitized.body;
      const session = await useCases.session.create.withPhone(token);
      res.status(HttpStatus.CREATED).json(session);
    })
  );

  return router;
};

