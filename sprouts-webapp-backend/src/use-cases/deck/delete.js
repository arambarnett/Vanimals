const ApplicationError = require("../../errors");

module.exports = ({
  database: { models: { Deck } },
}) => async ({ deckId, userId }) => {
  const deck = await Deck.findOne({ where: { id: deckId, userId } });
  if (!deck) throw new ApplicationError("DECK_NOT_AVAILABLE");
  return Deck.destroy({
    where: { id: deckId }
  });
};
