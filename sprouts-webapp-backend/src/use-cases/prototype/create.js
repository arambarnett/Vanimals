const { UniqueConstraintError } = require("sequelize");
const ApplicationError = require("../../errors");

module.exports = ({
  database: { models: { Prototype } },
}) => async (newPrototype) => {
  try {
    const prototype = await Prototype.create({ ...newPrototype });
    return prototype;
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      throw new ApplicationError("PROTOTYPE_ALREADY_EXIST");
    } else {
      throw err;
    }
  }
};
