const ApplicationError = require("../../errors");

module.exports = ({
  database: { models: { Deck, DeckInstance, Instance } },
}) => async ({ deckId, userId }) => {
  const deck = await Deck.findOne({
    where: { id: deckId, userId },
    include: [{
      model: DeckInstance,
      include: [
        { model: Instance },
      ]
    }]
  });
  if (!deck) throw new ApplicationError("DECK_NOT_FOUND");
  
  return deck;
};
