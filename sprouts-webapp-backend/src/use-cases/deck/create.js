const { UniqueConstraintError } = require("sequelize");
const ApplicationError = require("../../errors");

module.exports = ({
  database: { models: { Deck } },
}) => async ({ userId, name }) => {
  try {
    const deck = await Deck.create({ userId, name });
    return deck;
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      throw new ApplicationError("DECK_ALREADY_EXIST");
    } else {
      throw err;
    }
  }
};
