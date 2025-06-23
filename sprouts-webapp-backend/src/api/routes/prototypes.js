const wrapThrow = require("express-async-handler");
const HttpStatus = require("http-status");
const { Router } = require("express");

const { validate, schemas } = require("../validations");

module.exports = ({ useCases, middlewares }) => {
  const router = Router();

  router.post(
    "/",
    middlewares.withAuth.admin,
    validate(schemas.prototype.create),
    wrapThrow(async (req, res) => {
      const newPrototype = req.locals.sanitized.body;
      const prototype = await useCases.prototype.create(newPrototype);
      res.status(HttpStatus.CREATED).json(prototype);
    })
  );

  router.get(
    "/",
    middlewares.withAuth.admin,
    validate(schemas.prototype.getAll),
    wrapThrow(async (req, res) => {
      const options = req.locals.sanitized.query;
      const prototypes = await useCases.prototype.getAll(options);
      res.status(HttpStatus.OK).json({
        data: prototypes,
      });
    })
  );

  router.get(
    "/:prototypeId",
    middlewares.withAuth.admin,
    validate(schemas.prototype.get),
    wrapThrow(async (req, res) => {
      const { prototypeId } = req.locals.sanitized.params;
      const prototype = await useCases.prototype.get(prototypeId);
      res.status(HttpStatus.OK).json(prototype);
    })
  );

  router.post(
    "/:prototypeId/stat",
    middlewares.withAuth.admin,
    validate(schemas.stat.create),
    wrapThrow(async (req, res) => {
      const { prototypeId } = req.locals.sanitized.params;
      const newStat = req.locals.sanitized.body;
      const stat = await useCases.stat.create({ prototypeId, newStat });
      res.status(HttpStatus.OK).json(stat);
    })
  );

  router.post(
    "/:prototypeId/asset",
    middlewares.withAuth.admin,
    validate(schemas.prototypeAsset.create),
    wrapThrow(async (req, res) => {
      const { prototypeId } = req.locals.sanitized.params;
      const newAsset = req.locals.sanitized.body;
      const asset = await useCases.prototypeAsset.create({ prototypeId, newAsset });
      res.status(HttpStatus.OK).json(asset);
    })
  );

  router.delete(
    "/:prototypeId",
    middlewares.withAuth.admin,
    validate(schemas.prototype.delete),
    wrapThrow(async (req, res) => {
      const { prototypeId } = req.locals.sanitized.params;
      await useCases.prototype.delete(prototypeId);
      res.status(HttpStatus.OK).json();
    })
  );

  return router;
};
