const { GAME: { MAX_INSTANCES_IN_DECK: MAX_DECK } } = require("../../constants");
const { UniqueConstraintError } = require("sequelize");
const ApplicationError = require("../../errors");

module.exports = ({
  database: { models: { Deck, DeckInstance } },
}) => async ({ deckId, instanceId, userId }) => {
  const deck = await Deck.findOne({ where: { id: deckId, userId } });
  if (!deck) throw new ApplicationError("DECK_NOT_AVAILABLE");
  const deckInstances = await DeckInstance.count({ where: { deckId } });
  if (deckInstances >= MAX_DECK) throw new ApplicationError("DECK_IS_FULL");

  try {
    const deckInstance = await DeckInstance.create({ deckId, instanceId });
    return deckInstance;
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      throw new ApplicationError("DECK_INSTANCE_ALREADY_EXIST");
    } else {
      throw err;
    }
  }
};
