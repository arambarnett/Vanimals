const joi = require("./joi");

module.exports = {
  update: {
    body: joi.object({
      username: joi.string().optional().min(3).max(30).allow(null, ""),
      avatar: joi.string().optional().allow(null, ""),
    }).required()
  },
  get: {
    params: joi.object({
      userId: joi.string(),
    }).required(),
  },
  purchaseCreate: {
    body: joi.object({
      paymentMethodId: joi.string().required(),
      currency: joi.string().required(),
    }),
    params: joi.object({
      itemId: joi.string().optional(),
    }),
  },
  purchaseCkbCreate: {
    body: joi.object({
      quoteToken: joi.string().required(),
    }),
    params: joi.object({
      itemId: joi.string().optional(),
    }),
  },
  purchaseConfirm: {
    params: joi.object({
      purchaseId: joi.string().required(),
    }),
  },
  purchaseStatus: {
    params: joi.object({
      purchaseId: joi.string().required(),
    }),
  },
  purchaseCkbStatus: {
    params: joi.object({
      purchaseCkbId: joi.string().required(),
    }),
  },
  getBalance: {
    params: joi.object({
      publicKey: joi.string().required().min(10),
    }),
  },
  getItems: {
    query: joi.object({
      limit: joi.number().integer().min(1),
      offset: joi.number().integer().min(0),
    }).optional()
  },
  linkAuthenticationMethod: {
    body: joi.object({
      method: joi.string().allow("facebook", "google").required(),
      token: joi.string().required()
    }).required()
  },
  collections: {
    params: joi.object({
      nervosAddress: joi.string(),
    }).required(),

  },
};
