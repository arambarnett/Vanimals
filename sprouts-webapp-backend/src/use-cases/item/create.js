const { UniqueConstraintError, ForeignKeyConstraintError } = require("sequelize");
const ApplicationError = require("../../errors");

module.exports = ({
  database: { models: { Item } },
}) => async (newItem) => {
  try {
    const item = await Item.create({ ...newItem });
    return item;
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      throw new ApplicationError("ITEM_ALREADY_EXIST");
    } else if (err instanceof ForeignKeyConstraintError) {
      throw new ApplicationError("PROTOTYPE_NOT_AVAILABLE");
    } else {
      throw err;
    }
  }
};
