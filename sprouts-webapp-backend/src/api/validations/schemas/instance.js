const { PROTOTYPE_CATEGORY } = require("../../../constants");
const joi = require("./joi");

module.exports = {
  get: {
    params: joi.object({
      instanceId: joi.string(),
    }).required()
  },
  getAll: {
    query: joi.object({
      limit: joi.number().integer().min(1),
      offset: joi.number().integer().min(0),
      category: joi.string().valid(...Object.values(PROTOTYPE_CATEGORY)),
    }).optional()
  },
};
