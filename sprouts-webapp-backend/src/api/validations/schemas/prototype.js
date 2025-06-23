const joi = require("./joi");

module.exports = {
  create: {
    body: joi.object({
      name: joi.string().min(3).max(30).required(),
    })
  },
  get: {
    params: joi.object({
      prototypeId: joi.string(),
    }).required()
  },
  getAll: {
    query: joi.object({
      limit: joi.number().integer().min(1),
      offset: joi.number().integer().min(0),
    }).optional()
  },
  delete: {
    params: joi.object({
      prototypeId: joi.string(),
    }).required()
  },
};
