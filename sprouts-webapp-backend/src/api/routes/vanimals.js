// eslint-disable-next-line no-unused-vars
const ckbSdkUtils = require("@nervosnetwork/ckb-sdk-utils");
const wrapThrow = require("express-async-handler");
const HttpStatus = require("http-status");
const { Router } = require("express");
const { validate, schemas } = require("../validations");

module.exports = ({ vanimals, collections }) => {
  const router = Router();

  router.get(
    "/",
    wrapThrow(async (req, res) => {
      const dataFromNervos = vanimals.mockupVanimals;
      const response = vanimals.getAllVanimals(dataFromNervos);
      res.status(HttpStatus.OK).json(response);
    })
  );

  router.get(
    "/getByName/:name",
    validate(schemas.vanimal.get),
    wrapThrow(async (req, res) => {
      // Obtengo la data de los prototipos de vanimals de la BC
      const dataFromNervos = vanimals.mockupVanimals;
      const { name } = req.locals.sanitized.params;
      const response = vanimals.getVanimalByName(dataFromNervos, name);
      if (response) res.status(HttpStatus.OK).json(response);
      else res.status(HttpStatus.OK).json({ error: "No existing vanimal with that name" });
    })
  );
  // Se generan los datos una sola vez
  const data = collections.generateCollection(12);
  router.get(
    "/collections",
    validate(schemas.vanimal.getCollection),
    wrapThrow(async (req, res) => {
      // Aca cargo datos inventados, pero deberian ser los datos traidos de BC
      // eslint-disable-next-line no-unused-vars
      const options = req.locals.sanitized.query;
      // Aca se acomodan los datos para devolver al front
      const userCollections = collections.getData(data, options);
      res.status(HttpStatus.OK).json(userCollections);
    })
  );

  router.get(
    "/friendCollection",
    validate(schemas.vanimal.getFriendCollection),
    wrapThrow(async (req, res) => {
      // Aca cargo datos inventados, pero deberian ser los datos traidos de BC
      // eslint-disable-next-line no-unused-vars
      const options = req.locals.sanitized.query;
      // Aca se acomodan los datos para devolver al front
      const userCollections = collections.getData(data, options);
      const response = {
        username: options.username,
        collection: userCollections
      };
      res.status(HttpStatus.OK).json(response);
    })
  );
  return router;
};
