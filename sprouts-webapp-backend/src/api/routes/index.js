const moment = require("moment");
const { Router } = require("express");
const createPrototypeRoutes = require("./prototypes");
const createVanimalsRoutes = require("./vanimals");
const createSessionRoutes = require("./sessions");
const createAssetRoutes = require("./assets");
const createItemRoutes = require("./items");
const createUserRoutes = require("./users");
const asyncHandler = require("express-async-handler");
const ApplicationError = require("../../errors");
const { captureAndReportException } = require("../../utils");

module.exports = (dependencies) => {
  const { config, coinmarketcap, localCache, jwtManager, useCases } = dependencies;
  const { VERSION, WORKER_NAME, CKB } = config;
  const prototypeRoutes = createPrototypeRoutes(dependencies);
  const vanimalsRoutes = createVanimalsRoutes (dependencies);
  const sessionRoutes = createSessionRoutes(dependencies);
  const assetRoutes = createAssetRoutes(dependencies);
  const itemRoutes = createItemRoutes(dependencies);
  const userRoutes = createUserRoutes(dependencies);
  const router = Router();

  router.get("/health", (req, res) => {
    res.status(200).json({
      version: VERSION,
      id: WORKER_NAME,
    });
  });

  router.get("/ranking", async (req, res) => {
    // TODO
    const ranking = await useCases.user.getAll();
    res.status(200).json({ data: ranking });
  });

  router.get("/minimum-client-version", (req, res) => {
    res.status(200).json({
      version: config.CLIENT_MINIMUM_VERSION,
    });
  });

  /**
   * @deprecated /quote-tokens should be called instead
   */
  router.get("/ckb-rate",
    asyncHandler(async (req, res) => {
      let price;
      price = localCache.get("csm:ckb-rate");
      const error = "/quote-tokens should be called instead";
      if (price) return res.status(200).json({ price, error });
      const symbol = "CKB";
      const priceIn = "USD";
      try {
        const quotes = await coinmarketcap.getQuotes({ symbol });
        price = quotes.data[symbol].quote[priceIn].price;
        localCache.set("csm:ckb-rate", price, 120);
        return res.status(200).json({ price, error });
      } catch (err) {
        captureAndReportException(err);
        throw new ApplicationError("INVALID_QUOTE");
      }
    }));

  router.get("/quote-tokens",
    asyncHandler(async (req, res) => {
      let quote = null;
      quote = localCache.get("csm:ckb-rate");
      const expireAt = moment().add(CKB.QUOTE_LIFE, "seconds").unix();
      if (quote) {
        const quoteToken = await jwtManager.signAsync({ quote, expireAt });
        return res.status(200).json({ quote, quoteToken });
      }
      const symbol = "CKB";
      const priceIn = "USD";
      try {
        const quotes = await coinmarketcap.getQuotes({ symbol });
        quote = quotes.data[symbol].quote[priceIn].price;
        const quoteToken = await jwtManager.signAsync({ quote, expireAt });
        localCache.set("csm:ckb-rate", quote, 120);
        return res.status(200).json({ quote, quoteToken });
      } catch (err) {
        captureAndReportException(err);
        throw new ApplicationError("INVALID_QUOTE");
      }
    }));

  router.use("/users", userRoutes);
  router.use("/items", itemRoutes);
  router.use("/assets", assetRoutes);
  router.use("/sessions", sessionRoutes);
  router.use("/vanimals", vanimalsRoutes);
  router.use("/prototypes", prototypeRoutes);

  return router;
};
