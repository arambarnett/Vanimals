const joi = require("./joi");
module.exports = {
  get: {
    params: joi.object({
      name: joi.string(),
    }).required(),
  },
  getCollection: {
    query: joi.object({
      limit: joi.number().integer().min(1),
      offset: joi.number().integer().min(0),
      type: joi.string()
    }).optional()
  },
  getFriendCollection: {
    query: joi.object({
      username: joi.string().required(),
      userAddress: joi.string().required(),
      limit: joi.number().integer().min(1).optional(),
      offset: joi.number().integer().min(0).optional(),
      type: joi.string().optional()
    })

  }
};
