const { PROTOTYPE_CATEGORY, ITEM_FILTERS } = require("../../../constants");
const joi = require("./joi");

module.exports = {
  create: {
    body: joi.object({
      name: joi.string().min(3).max(30).required(),
      type: joi.string().required(),
      generator: joi.string().optional(),
      prototypeId: joi.string().optional(),
      price: joi.number().integer().required(),
      promoPrice: joi.number().integer().optional(),
      asset: joi.string().optional(),
      assetType: joi.string().optional(),
    })
  },
  get: {
    params: joi.object({
      itemId: joi.string(),
    }).required()
  },
  getAll: {
    query: joi.object({
      limit: joi.number().integer().min(1),
      offset: joi.number().integer().min(0),
      category: joi.string().valid(...Object.values(PROTOTYPE_CATEGORY)),
      filter: joi.string().valid(...Object.values(ITEM_FILTERS)),
    }).optional()
  },
  delete: {
    params: joi.object({
      itemId: joi.string(),
    }).required()
  },
};
