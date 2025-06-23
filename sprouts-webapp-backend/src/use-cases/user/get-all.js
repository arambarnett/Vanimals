module.exports = ({
  database: { models: { User } },
}) => async () => {
  const users = await User.findAll({
    limit: 20,
    order: [["updatedAt"]],
  });
  // TODO create gaming flow and tables
  const ranking = [];
  users.forEach( (user, index) => {
    ranking.push({ ...user.dataValues,
      ranking: index + 1,
      wins: 0,
      losses: 0,
      score: 0,
      bestDeck: []
    });
  });
  
  return ranking;
};
