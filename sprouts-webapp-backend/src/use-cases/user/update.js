const ApplicationError = require("../../errors");
const { normalizeUsername } = require("../../utils");

module.exports = ({
  database: { models: { User } }
}) => async (userId, changes) => {
  let username;
  if (changes.username) {
    username = normalizeUsername(changes.username);
    if (username.length < 3) throw new ApplicationError("USERNAME_INVALID");
  }

  try {
    const [amountUpdated] = await User
      .update(
        {
          ...changes,
          ...(username && { username })
        },
        {
          where: {
            id: userId
          }
        }
      );
    if (!amountUpdated) throw new ApplicationError("USER_NOT_FOUND");
    return;
  } catch (err) {
    throw new ApplicationError("USERNAME_ALREADY_USED");
  }
};
