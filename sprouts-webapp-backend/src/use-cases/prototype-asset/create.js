const { UniqueConstraintError, ForeignKeyConstraintError } = require("sequelize");
const ApplicationError = require("../../errors");

module.exports = ({
  database: { models: { PrototypeAsset } },
}) => async ( { prototypeId, newAsset }) => {
  try {
    const asset = await PrototypeAsset.create({ prototypeId, ...newAsset });
    return asset;
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      throw new ApplicationError("ASSET_ALREADY_EXIST");
    } else if (err instanceof ForeignKeyConstraintError) {
      throw new ApplicationError("PROTOTYPE_NOT_AVAILABLE");
    } else {
      throw err;
    }
  }
};
