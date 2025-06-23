module.exports = ({
  database: { models: { User, AuthenticationMethod, Session } }
}) => async (userId) => {
  await Session.destroy({ where: { userId } });
  await AuthenticationMethod.destroy({ where: { userId } });
  await User.destroy({ where: { id: userId } });
};
