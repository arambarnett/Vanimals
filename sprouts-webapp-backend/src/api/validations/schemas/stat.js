const joi = require("./joi");

module.exports = {
  create: {
    params: joi.object({
      prototypeId: joi.string(),
    }).required(),
    body: joi.object({
      statType: joi.string().required(),
      value: joi.number().integer().min(0).required(),
    })
  },
};
