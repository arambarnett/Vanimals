// eslint-disable-next-line no-unused-vars
const ckbSdkUtils = require("@nervosnetwork/ckb-sdk-utils");
const wrapThrow = require("express-async-handler");
const HttpStatus = require("http-status");
const { Router } = require("express");
const moment = require("moment");

const { validate, schemas } = require("../validations");
const ApplicationError = require("../../errors");

module.exports = ({ useCases, ckb, middlewares, config, stripe, jwtManager, collections }) => {
  const router = Router();

  router.get(
    "/me",
    middlewares.withAuth.required,
    wrapThrow(async (req, res) => {
      const userId = req.locals.session.user.id;
      const user = await useCases.user.get(userId);
      res.status(HttpStatus.OK).json(user);
    })
  );

  router.get(
    "/:userId",
    validate(schemas.user.get),
    wrapThrow(async (req, res) => {
      const { userId } = req.locals.sanitized.params;
      const user = await useCases.user.get(userId);
      res.status(HttpStatus.OK).json(user);
    })
  );

  router.patch(
    "/me",
    validate(schemas.user.update),
    middlewares.withAuth.required,
    wrapThrow(async (req, res) => {
      const userId = req.locals.session.user.id;
      const updates = req.locals.sanitized.body;
      const newUser = await useCases.user.update(userId, updates);
      res.status(HttpStatus.NO_CONTENT).json(newUser);
    })
  );

  router.post(
    "/me/authentication-methods",
    validate(schemas.user.linkAuthenticationMethod),
    middlewares.withAuth.required,
    wrapThrow(async (req, res) => {
      const user = req.locals.session.user;
      const context = { user };
      const { method, token } = req.locals.sanitized.body;
      await useCases.user.linkAuthenticationMethod({ method, token }, context);
      res.status(HttpStatus.NO_CONTENT).end();
    })
  );

  if (config.DANGEROUSLY_ENABLE_TESTING_TOOLS === "yes, enable testing tools") {
    router.delete(
      "/me",
      middlewares.withAuth.required,
      wrapThrow(async (req, res) => {
        const userId = req.locals.session.user.id;
        await useCases.user.hardDelete(userId);
        res.status(HttpStatus.NO_CONTENT).end();
      })
    );
  }

  // ! DELETE if not needed, used for initial local tests
  router.get(
    "/stripe-key",
    middlewares.withAuth.required,
    wrapThrow(async (req, res) => {
      const publishableKey = stripe.getPublishableKey();
      res.status(HttpStatus.OK).json({ publishableKey });
    })
  );

  router.post(
    "/me/:itemId/buy",
    validate(schemas.user.purchaseCreate),
    middlewares.withAuth.required,
    wrapThrow(async (req, res) => {
      const {
        body: order,
        params: { itemId },
      } = req.locals.sanitized;
      const userId = req.locals.session.user.id;

      const item = await useCases.item.get(itemId);
      const itemPrice = item.promoPrice || item.price;

      const intent = await useCases.payment
        .intentCreate({ itemPrice, itemId, userId, order });

      let instance = {};
      if (intent.status.toLowerCase() === "succeeded") {
        instance = await useCases.instance
          .mint({ item, userId, purchaseId: intent.purchaseId });
      }

      res.status(HttpStatus.OK).json({ ...intent, instance });
    })
  );

  router.post(
    "/me/:itemId/buy/ckb",
    validate(schemas.user.purchaseCkbCreate),
    middlewares.withAuth.required,
    wrapThrow(async (req, res) => {
      const {
        body: { quoteToken },
        params: { itemId },
      } = req.locals.sanitized;

      const { quote, expireAt } = await jwtManager.verifyAsync(quoteToken);

      if (moment.utc(expireAt * 1000).isBefore()) {
        return res.status(HttpStatus.GONE).json({ error: "Expired price" });
      }
      const userId = req.locals.session.user.id;
      const item = await useCases.item.get(itemId);
      const itemPrice = item.promoPrice || item.price;
      const purchaseCkb = await useCases.purchase.createCkb({
        itemPriceCkb: Math.trunc(itemPrice / quote / 100),
        itemPrice,
        itemId,
        userId,
      });

      return res.status(HttpStatus.CREATED).json({
        expireInMinutes: config.CKB.PAYMENT_MINUTES_SPAN,
        purchaseCkbId: purchaseCkb.id,
        ckbPrice: purchaseCkb.itemPriceCkb,
        address: purchaseCkb.depositAddress,
        status: purchaseCkb.paymentStatus,
      });
    })
  );

  router.post(
    "/me/purchases/:purchaseId/confirm",
    validate(schemas.user.purchaseConfirm),
    middlewares.withAuth.required,
    wrapThrow(async (req, res) => {
      const userId = req.locals.session.user.id;
      const purchaseId = req.locals.sanitized.params.purchaseId;
      const confirmation = await useCases.purchase.confirm({ purchaseId, userId });

      let instance = {};
      if (confirmation.status.toLowerCase() === "succeeded") {
        instance = await useCases.instance
          .mint({ userId, purchaseId, item: confirmation.purchase.item });
      }
      res.status(HttpStatus.OK).json({ ...confirmation, instance });
    })
  );

  router.get(
    "/me/purchases",
    validate(schemas.user.getItems),
    middlewares.withAuth.required,
    wrapThrow(async (req, res) => {
      const userId = req.locals.session.user.id;
      const { limit, offset } = req.locals.sanitized.query;
      const result = await useCases.purchase.get({ userId, limit, offset });
      res.status(HttpStatus.OK).json({ data: result });
    })
  );

  router.patch(
    "/me/purchases/:purchaseId/status",
    middlewares.withAuth.required,
    validate(schemas.user.purchaseStatus),
    wrapThrow(async (req, res) => {
      const userId = req.locals.session.user.id;
      const purchaseId = req.locals.sanitized.params.purchaseId;
      const status = await useCases.purchase.status({ purchaseId, userId });

      let instance = {};
      if (status.status.toLowerCase() === "succeeded") {
        instance = await useCases.instance
          .mint({ userId, purchaseId, item: status.purchase.item });
      }

      res.status(HttpStatus.OK).json({ ...status, instance });
    })
  );

  router.get(
    "/me/balance/:publicKey",
    validate(schemas.user.getBalance),
    middlewares.withAuth.required,
    wrapThrow(async (req, res) => {
      const { publicKey } = req.locals.sanitized.params;

      try {
        const balance = await ckb.getBalance(publicKey);
        return res.status(HttpStatus.OK).json({ ckb: balance });
      } catch (err) {
        throw new ApplicationError("INVALID_ADDRESS");
      }
    })
  );

  router.patch(
    "/me/purchases/ckb/:purchaseCkbId/status",
    middlewares.withAuth.required,
    validate(schemas.user.purchaseCkbStatus),
    wrapThrow(async (req, res) => {
      const userId = req.locals.session.user.id;
      const purchaseCkbId = req.locals.sanitized.params.purchaseCkbId;
      const status = await useCases.purchase.statusCkb({ purchaseCkbId, userId });

      let instance = {};
      if (status.status.toLowerCase() === "succeeded") {
        instance = await useCases.instance
          .mintCkb({ userId, purchaseCkbId, item: status.purchaseCkb.item });
      }
      res.status(HttpStatus.OK).json({ ...status, instance });
    })
  );

  router.get(
    "/me/instances",
    middlewares.withAuth.required,
    validate(schemas.instance.getAll),
    wrapThrow(async (req, res) => {
      const options = req.locals.sanitized.query;
      const userId = req.locals.session.user.id;
      const result = await useCases.instance.getAll({ ...options, userId });
      res.status(HttpStatus.OK).json({ data: result });
    })
  );

  router.get(
    "/me/instances/:instanceId",
    middlewares.withAuth.required,
    validate(schemas.instance.get),
    wrapThrow(async (req, res) => {
      const { instanceId } = req.locals.sanitized.params;
      const userId = req.locals.session.user.id;
      const { instance, points } = await useCases.instance.get({ instanceId, userId });
      res.status(HttpStatus.OK).json({ data: { instance, points } });
    })
  );

  router.get(
    "/me/decks",
    middlewares.withAuth.required,
    validate(schemas.deck.getAll),
    wrapThrow(async (req, res) => {
      const options = req.locals.sanitized.query;
      const userId = req.locals.session.user.id;
      const decks = await useCases.deck.getAll({ ...options, userId });
      res.status(HttpStatus.OK).json({ data: decks });
    })
  );

  router.post(
    "/me/decks",
    middlewares.withAuth.required,
    validate(schemas.deck.create),
    wrapThrow(async (req, res) => {
      const { name } = req.locals.sanitized.body;
      const userId = req.locals.session.user.id;
      const deck = await useCases.deck.create({ name, userId });
      res.status(HttpStatus.CREATED).json({ data: deck });
    })
  );

  router.delete(
    "/me/decks/:deckId",
    middlewares.withAuth.required,
    validate(schemas.deck.delete),
    wrapThrow(async (req, res) => {
      const { deckId } = req.locals.sanitized.params;
      const userId = req.locals.session.user.id;
      await useCases.deck.delete({ deckId, userId });
      res.status(HttpStatus.OK).json();
    })
  );

  router.get(
    "/me/decks/:deckId",
    middlewares.withAuth.required,
    validate(schemas.deck.get),
    wrapThrow(async (req, res) => {
      const { deckId } = req.locals.sanitized.params;
      const userId = req.locals.session.user.id;
      const deck = await useCases.deck.get({ deckId, userId });
      res.status(HttpStatus.OK).json({ data: deck });
    })
  );

  router.post(
    "/me/deck/:instanceId/:deckId",
    middlewares.withAuth.required,
    validate(schemas.deck.add),
    wrapThrow(async (req, res) => {
      const { deckId, instanceId } = req.locals.sanitized.params;
      const userId = req.locals.session.user.id;
      const deck = await useCases.deck.add({ deckId, instanceId, userId });
      res.status(HttpStatus.CREATED).json({ data: deck });
    })
  );

  router.delete(
    "/me/deck/:instanceId/:deckId",
    middlewares.withAuth.required,
    validate(schemas.deck.remove),
    wrapThrow(async (req, res) => {
      const { deckId, instanceId } = req.locals.sanitized.params;
      const userId = req.locals.session.user.id;
      await useCases.deck.remove({ deckId, instanceId, userId });
      res.status(HttpStatus.OK).json();
    })
  );

  router.get(
    "/:nervosAddress",
    validate(schemas.user.collections),
    wrapThrow(async (req, res) => {
      // eslint-disable-next-line no-unused-vars
      const userAddress = req.locals.sanitize.params.userNervosAddress;
      // Aca cargo datos inventados, pero deberian ser los datos traidos de BC
      const data = collections.mockupCollection;
      // Aca se acomodan los datos para devolver al front
      const userCollections = collections.getData(data);
      res.status(HttpStatus.OK).json(userCollections);
    })
  );

  return router;
};
