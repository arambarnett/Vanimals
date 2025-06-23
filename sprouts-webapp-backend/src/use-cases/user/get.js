const ApplicationError = require("../../errors");

module.exports = ({
  database: { models: { User } },
}) => async (userId) => {
  let user = await User.findOne({
    where: { id: userId },
  });
  if (!user) throw new ApplicationError("USER_NOT_FOUND");

  // TODO create gaming flow and tables
  user = { ...user.dataValues,
    ranking: null,
    wins: 0,
    losses: 0,
    score: 0,
    bestDeck: []
  };
  
  return user;
};
