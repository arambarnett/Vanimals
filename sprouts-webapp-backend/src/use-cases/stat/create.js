const { UniqueConstraintError, ForeignKeyConstraintError } = require("sequelize");
const ApplicationError = require("../../errors");

module.exports = ({
  database: { models: { Stat } },
}) => async ( { prototypeId, newStat }) => {
  try {
    const stat = await Stat.create({ prototypeId, ...newStat });
    return stat;
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      throw new ApplicationError("STAT_ALREADY_EXIST");
    } else if (err instanceof ForeignKeyConstraintError) {
      throw new ApplicationError("PROTOTYPE_NOT_AVAILABLE");
    } else {
      throw err;
    }
  }
};
