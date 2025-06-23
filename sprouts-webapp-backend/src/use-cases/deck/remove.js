const ApplicationError = require("../../errors");

module.exports = ({
  database: { models: { Deck, DeckInstance } },
}) => async ({ deckId, instanceId, userId }) => {
  const deck = await Deck.findOne({ where: { id: deckId, userId } });
  if (!deck) throw new ApplicationError("DECK_NOT_AVAILABLE");
  return DeckInstance.destroy({
    where: { deckId, instanceId }
  });
};
