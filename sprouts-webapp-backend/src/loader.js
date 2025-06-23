
const Coinmarketcap = require("coinmarketcap-api");
const LocalCache = require("node-cache");

const Collections = require("./lib/collections");
const JwtManager = require("./lib/jwt-manager");
const Vanimals = require("./lib/vanimals");
const Facebook = require("./lib/facebook");
const UseCases = require("./use-cases");
const Stripe = require("./lib/stripe");
const Google = require("./lib/google");
const Logger = require("./lib/logger");

const Database = require("./database");
const Aws = require("./lib/aws");
const Ckb = require("./lib/ckb");
const Api = require("./api");

module.exports = async (config) => {
  /*
  *  --------  Libs  --------
  */
  const coinmarketcap = new Coinmarketcap(config.COINMARKETCAP.API_KEY);
  const jwtManager = await JwtManager(config.JWT_SIGNING_SECRET);
  const google = await Google(config.GOOGLE);
  const facebook = await Facebook();
  const stripe = Stripe(config);
  const logger = Logger(config);
  const ckb = await Ckb(config);
  const aws = Aws(config);
  const collections = Collections;
  const vanimals = Vanimals;

  /*
  *  --------  Data Layer  ---------
  */
  const localCache = new LocalCache({ stdTTL: 3600 });
  const database = await Database({ logger, config, cache: localCache });

  /*
  *  --------  Business Logic   --------
  */
  const useCases = UseCases({
    aws,
    ckb,
    logger,
    google,
    stripe,
    config,
    facebook,
    database,
    jwtManager,
    localCache,
    coinmarketcap,
  });

  /*
  *   --------  Interfaces   --------
  */
  const api = Api({
    ckb,
    aws,
    stripe,
    logger,
    config,
    useCases,
    jwtManager,
    localCache,
    coinmarketcap,
    collections,
    vanimals,
  });

  return {
    database,
    useCases,
    api,
  };
};
