const joi = require("./joi");

module.exports = {
  get: {
    params: joi.object({
      token: joi.string().required()
    }).required()
  },
  create: {
    google: {
      body: joi.object({
        token: joi.string().required()
      }).required()
    },
    facebook: {
      body: joi.object({
        token: joi.string().required()
      }).required()
    },
    metamask: {
      body: joi.object({
        signature: joi.string().required(),
        jwt: joi.string().required(),
      }).required()
    },
  }
};
