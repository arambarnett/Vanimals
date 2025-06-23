const joi = require("./joi");

module.exports = {
  create: {
    params: joi.object({
      prototypeId: joi.string(),
    }).required(),
    body: joi.object({
      type: joi.string().required(),
      value: joi.string().required(),
    })
  },
};
