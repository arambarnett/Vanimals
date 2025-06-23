module.exports = ({
  database: { models: { Deck } },
}) => async ({ userId, limit = 20, offset = 0 }) => {
  const decks = await Deck.findAll({
    limit, offset,
    where: { userId },
  });
  
  return decks;
};
