const joi = require("./joi");

module.exports = {
  pagination: {
    query: joi.object({
      page: joi.number().min(0).optional().default(0),
      limit: joi.number().min(1).max(100).optional().optional(10),
    }).required().unknown(true)
  }
};
