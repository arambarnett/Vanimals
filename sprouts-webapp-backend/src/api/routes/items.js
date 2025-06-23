const { PROTOTYPE_CATEGORY, ITEM_TYPE } = require("../../constants");
const wrapThrow = require("express-async-handler");
const HttpStatus = require("http-status");
const { Router } = require("express");

const { validate, schemas } = require("../validations");

module.exports = ({ useCases, middlewares }) => {
  const router = Router();

  router.post(
    "/",
    middlewares.withAuth.admin,
    validate(schemas.item.create),
    wrapThrow(async (req, res) => {
      const newItem = req.locals.sanitized.body;
      const item = await useCases.item.create(newItem);
      res.status(HttpStatus.CREATED).json(item);
    })
  );

  router.get(
    "/",
    validate(schemas.item.getAll),
    wrapThrow(async (req, res) => {
      const options = req.locals.sanitized.query;
      options.where = { type: ITEM_TYPE.PROTOTYPE };
      const items = await useCases.item.getAll(options);
      res.status(HttpStatus.OK).json({
        data: items,
      });
    })
  );

  router.get(
    "/packs",
    validate(schemas.item.getAll),
    wrapThrow(async (req, res) => {
      const options = req.locals.sanitized.query;
      options.where = { type: ITEM_TYPE.PACK };
      const items = await useCases.item.getAll(options);
      res.status(HttpStatus.OK).json({
        data: items,
      });
    })
  );

  router.get(
    "/categories",
    validate(schemas.item.getAll),
    wrapThrow(async (req, res) => {
      res.status(HttpStatus.OK).json({
        data: Object.values(PROTOTYPE_CATEGORY)
      });
    })
  );

  router.get(
    "/:itemId",
    validate(schemas.item.get),
    wrapThrow(async (req, res) => {
      const { itemId } = req.locals.sanitized.params;
      const item = await useCases.item.get(itemId);
      res.status(HttpStatus.OK).json(item);
    })
  );

  router.delete(
    "/:itemId",
    middlewares.withAuth.admin,
    validate(schemas.item.delete),
    wrapThrow(async (req, res) => {
      const { itemId } = req.locals.sanitized.params;
      await useCases.item.delete(itemId);
      res.status(HttpStatus.OK).json();
    })
  );

  return router;
};
